import React from "react";
import { Dropdown, Tooltip } from "antd";
import { FlagFilled, FlagOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setTaskPriority } from "../../redux/todoSlice";
import { TASK_PRIORITIES } from "../../constant";
import { Task } from "../../types";

const stop = (e: React.SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const PriorityFlagPicker = ({ task }: { task: Task }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const activePriority = TASK_PRIORITIES.find((p) => p.key === task.priority);

  return (
    <Tooltip
      arrow={false}
      title={t('todoList.setPriorityTooltip')}
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
    >
      <div onClick={stop} onMouseDown={stop} onMouseUp={stop}>
        <Dropdown
          menu={{
            items: TASK_PRIORITIES.map((priority) => ({
              key: priority.key,
              label: (
                <span
                  className="priority-menu-item"
                  style={
                    task.priority === priority.key
                      ? { color: priority.color, fontWeight: 700 }
                      : undefined
                  }
                >
                  <FlagFilled style={{ color: priority.color }} />
                  {priority.label}
                </span>
              ),
              className: "priority-menu-item-wrapper",
            })),
            onClick: ({ key, domEvent }) => {
              domEvent.preventDefault();
              domEvent.stopPropagation();
              dispatch(
                setTaskPriority({
                  id: task.id,
                  categoryId: task.categoryId,
                  priority: key,
                }),
              );
            },
          }}
          trigger={["click"]}
        >
          {activePriority ? (
            <FlagFilled
              className="priority-icon active"
              style={{ color: activePriority.color }}
              onClick={stop}
              onMouseDown={stop}
              onMouseUp={stop}
            />
          ) : (
            <FlagOutlined
              className="priority-icon"
              onClick={stop}
              onMouseDown={stop}
              onMouseUp={stop}
            />
          )}
        </Dropdown>
      </div>
    </Tooltip>
  );
};

export default PriorityFlagPicker;
