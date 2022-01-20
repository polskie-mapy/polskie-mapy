export default function createDelegatedTasksHandler(createWorker) {
    // need to create worker in closure, so webpack
    // handles imports within web worker correctly
    const worker = createWorker();

    return store => {
        store.delegateTask = function delegateTask(name, payload) {
            const taskId = store.getters['_tasks/nextTaskId'] | 0;

            return new Promise((resolve, rescue) => {
                store.commit('_tasks/addTask', {
                    resolve,
                    rescue,
                    name
                });

                store.getters['_tasks/workerHandle'].postMessage({
                    type: name,
                    args: Array.isArray(payload) ? payload : [payload].filter(x => x),
                    taskId,
                });
            }).finally(() => {
                store.commit('_tasks/removeTask', taskId);
            });
        };

        store.registerModule('_tasks', {
            namespaced: true,
            state: () => ({
                workerHandle: worker,
                tasks: new Map(),
                lastTaskId: 0
            }),
            getters: {
                nextTaskId: (state) => state.lastTaskId + 1,
                workerHandle: (state) => state.workerHandle,
                tasks: (state) => state.tasks,
            },
            mutations: {
                addTask(state, taskData) {
                    state.tasks.set(++state.lastTaskId, {
                        ...taskData,
                        taskId: state.lastTaskId,
                    });
                },
                removeTask(state, taskId) {
                    state.tasks.delete(taskId)
                }
            },
        });

        worker.addEventListener('message', (msg) => {
            const {taskId, data} = msg.data;
            const {resolve} = store.getters['_tasks/tasks'].get(taskId);

            resolve(data, taskId);
        });

        worker.addEventListener('messageerror', (msg) => {
            const {taskId, data} = msg.data;
            const {rescue} = store.getters['_tasks/tasks'].get(taskId);

            rescue(data, taskId);
        });
    }
}