import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTasksByPriority, deleteTask } from "../../redux/todoSlice";
import { RootState } from "../../redux/store";
import { Subtask, Task, TaskPriority } from "../../types";
import { Collapse, Popconfirm, Empty, message } from "antd";
import "./index.scss";
import { selectCategories } from "../../redux/categorySlice";
import TodoItem from "../todo-item";
import PriorityFlagPicker from "../priority-flag-picker";
import { DeleteOutlined } from "@ant-design/icons";

const PriorityTodoList = ({ priority }: { priority: TaskPriority }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) =>
    selectTasksByPriority(state, priority),
  );
  const folders = useSelector(selectCategories);
  const [messageApi, contextHolder] = message.useMessage();

  const genExtra = (task: Task) => {
    return (
      <div className="todo-actions" onClick={(e) => e.stopPropagation()}>
        <PriorityFlagPicker task={task} />
        <Popconfirm
          title={t('completed.confirmDeleteTask')}
          okText={t('completed.yesDelete')}
          onConfirm={(e) => {
            e?.stopPropagation();
            dispatch(deleteTask({ id: task.id, categoryId: task.categoryId }));
            messageApi.open({
              type: "success",
              content: t('completed.taskDeleted', { text: task.text }),
            });
          }}
          cancelText={t('sidebar.cancel')}
        >
          <DeleteOutlined
            className="delete-icon"
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      </div>
    );
  };

  const groupedTasks = tasks.reduce(
    (acc: { [key: string]: Task[] }, task) => {
      const folderId = task.categoryId;
      if (!acc[folderId]) {
        acc[folderId] = [];
      }
      acc[folderId].push(task);
      return acc;
    },
    {},
  );

  const folderIdToName = folders.reduce(
    (acc: { [key: string]: string }, folder) => {
      acc[folder.id] = folder.name;
      return acc;
    },
    {},
  );

  return (
    <div className="priority-todo-list">
      {contextHolder}
      {tasks.length > 0 && (
        <div className="priority-todo-items-groups">
          {Object.keys(groupedTasks).map((folderId) => {
            const folderTasks = groupedTasks[folderId];
            return (
              <div className="priority-todo-items-group" key={folderId}>
                <div className="priority-todo-items-group-header">
                  {folderIdToName[folderId]}
                </div>
                <Collapse
                  expandIconPosition={"start"}
                  activeKey={folderTasks
                    .filter((task) => task.subtasks.length > 0)
                    .map((task) => `${task.id}-${folderId}`)}
                >
                  {folderTasks.map((task, index) => (
                    <Collapse.Panel
                      header={<TodoItem todoItem={task} index={index} />}
                      key={`${task.id}-${folderId}`}
                      extra={genExtra(task)}
                      showArrow={false}
                    >
                      <div className="subtasks">
                        {task.subtasks.map(
                          (subtask: Subtask, index: number) => (
                            <TodoItem
                              todoItem={subtask}
                              key={`${subtask.id}-${folderId}`}
                              index={index}
                            />
                          ),
                        )}
                      </div>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </div>
            );
          })}
        </div>
      )}
      {tasks.length === 0 && (
        <div className="no-priority-todos">
          <Empty
            description={t('priorityView.noTasks')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </div>
  );
};

export default PriorityTodoList;
