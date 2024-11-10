# TimeLine
## 主文件
```tsx
import * as React from 'react';
import classNames from 'classnames';

import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
// CSSINJS
import useStyle from './style';
import type { TimelineItemProps } from './TimelineItem';
import TimelineItem from './TimelineItem';
import TimelineItemList from './TimelineItemList';
import useItems from './useItems';

export interface TimelineProps {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending?: React.ReactNode;
  pendingDot?: React.ReactNode;
  style?: React.CSSProperties;
  reverse?: boolean;
  mode?: 'left' | 'alternate' | 'right';
  items?: TimelineItemProps[];
  children?: React.ReactNode;
}

type CompoundedComponent = React.FC<TimelineProps> & {
  Item: React.FC<TimelineItemProps>;
};

const Timeline: CompoundedComponent = (props) => {
  const { getPrefixCls, direction, timeline } = React.useContext(ConfigContext);
  // 对 children、items、className、style、进行解构
  const { prefixCls: customizePrefixCls, children, items, className, style, ...restProps } = props;
  const prefixCls = getPrefixCls('timeline', customizePrefixCls);

  // =================== Warning =====================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Timeline');

    warning.deprecated(!children, 'Timeline.Item', 'items');
  }

  // Style
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);

  // 根据 items 和 children 进行判断处理
  const mergedItems: TimelineItemProps[] = useItems(items, children);

  // render TimelineItemList 部分
  return wrapCSSVar(
    <TimelineItemList
      {...restProps}
      className={classNames(timeline?.className, className, cssVarCls, rootCls)}
      style={{ ...timeline?.style, ...style }}
      prefixCls={prefixCls}
      direction={direction}  // 全局的 direction 配置
      items={mergedItems}
      hashId={hashId}
    />,
  );
};

Timeline.Item = TimelineItem;

if (process.env.NODE_ENV !== 'production') {
  Timeline.displayName = 'Timeline';
}

export default Timeline;

```


## useItems.tsx
```tsx
import type * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';

import type { TimelineItemProps } from './TimelineItem';

function useItems(items?: TimelineItemProps[], children?: React.ReactNode): TimelineItemProps[] {
  // 优先级处理
  // items > children
  if (items && Array.isArray(items)) {
    return items;
  }

  // 将children转为数组，处理成 TimelineItemProps 格式
  return toArray(children).map((ele: React.ReactElement<any>) => ({
    children: ele?.props?.children ?? '',
    ...ele.props,
  }));
}

export default useItems;

```

## toArray 方法
```ts
import React from 'react';
import { isFragment } from 'react-is';

export interface Option {
  keepEmpty?: boolean;
}

export default function toArray(
  children: React.ReactNode,
  option: Option = {},
): React.ReactElement[] {
  let ret: React.ReactElement[] = [];

  React.Children.forEach(children, (child: any | any[]) => {
    if ((child === undefined || child === null) && !option.keepEmpty) {
      return;
    }

    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option));
    } else {
      ret.push(child);
    }
  });

  return ret;
}
```

## timelineitemlist.tsx
```tsx
import * as React from 'react';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import classNames from 'classnames';

import type { TimelineProps } from './Timeline';
import TimelineItem from './TimelineItem';
import type { TimelineItemProps } from './TimelineItem';

const TimelineItemList: React.FC<TimelineProps & { hashId: string; direction?: string }> = ({
  prefixCls,
  className,
  pending = false, // 是否有幽灵节点
  children,
  items,
  rootClassName,
  reverse = false,
  direction,
  hashId,
  pendingDot, // 幽灵节点，点的内容
  mode = '' as TimelineProps['mode'],
  ...restProps
}) => {
  // 获取点的位置的class
  const getPositionCls = (position: string, idx: number) => {
    if (mode === 'alternate') {
      if (position === 'right') return `${prefixCls}-item-right`;
      if (position === 'left') return `${prefixCls}-item-left`;
      return idx % 2 === 0 ? `${prefixCls}-item-left` : `${prefixCls}-item-right`;
    }
    if (mode === 'left') return `${prefixCls}-item-left`;
    if (mode === 'right') return `${prefixCls}-item-right`;
    if (position === 'right') return `${prefixCls}-item-right`;
    return '';
  };

  // 合并items
  const mergedItems = [...(items || [])];

  // 判断是否有幽灵节点，返回结果
  const pendingNode = typeof pending === 'boolean' ? null : pending;

  // 如果存在幽灵节点，插入到items中
  if (pending) {
    mergedItems.push({
      pending: !!pending,
      dot: pendingDot || <LoadingOutlined />,
      children: pendingNode,
    });
  }

  // 处理节点排序
  if (reverse) {
    mergedItems.reverse();
  }

  // items 的数量
  const itemsCount = mergedItems.length;

  // 获取最后一个节点的class
  const lastCls = `${prefixCls}-item-last`;

  // 循环 timelineitem
  const itemsList = mergedItems
    // 过滤空节点 
    .filter((item: TimelineItemProps) => !!item)
    .map((item: TimelineItemProps, idx: number) => {
      // pending 节点样式
      const pendingClass = idx === itemsCount - 2 ? lastCls : '';
      // 普通节点样式
      const readyClass = idx === itemsCount - 1 ? lastCls : '';
      // 
      const { className: itemClassName, ...itemProps } = item;

      return (
        <TimelineItem
          {...itemProps}
          className={classNames([
            itemClassName,
            !reverse && !!pending ? pendingClass : readyClass,
            getPositionCls(item?.position ?? '', idx),
          ])}
          /* eslint-disable-next-line react/no-array-index-key */
          key={item?.key || idx}
        />
      );
    });

  // mergedItems 中是否存在 label
  const hasLabelItem = mergedItems.some((item: TimelineItemProps) => !!item?.label);

  const classString = classNames(
    prefixCls,
    {
      [`${prefixCls}-pending`]: !!pending,
      [`${prefixCls}-reverse`]: !!reverse,
      [`${prefixCls}-${mode}`]: !!mode && !hasLabelItem,
      [`${prefixCls}-label`]: hasLabelItem, // 存在 label，加label样式
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    className,
    rootClassName,
    hashId,
  );

  // render 部分
  return (
    <ul {...restProps} className={classString}>
      {itemsList}
    </ul>
  );
};

export default TimelineItemList;
```

## timelineitem.tsx
```tsx
import * as React from 'react';
import classNames from 'classnames';

import type { LiteralUnion } from '../_util/type';
import { ConfigContext } from '../config-provider';

type Color = 'blue' | 'red' | 'green' | 'gray';

// item 的 props 类型
export interface TimelineItemProps {
  key?: React.Key;
  prefixCls?: string;
  className?: string;
  color?: LiteralUnion<Color>;
  dot?: React.ReactNode;
  pending?: boolean;
  position?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;
  children?: React.ReactNode;
}

// for compatibility
// https://github.com/ant-design/ant-design/pull/26832
export interface TimeLineItemProps extends TimelineItemProps {
  __deprecated_do_not_use_it__?: any; // eslint-disable-line camelcase
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  prefixCls: customizePrefixCls,
  className,
  color = 'blue',
  dot,
  pending = false,
  position /** 老的配置，还在兼容 */,
  label,
  children,
  ...restProps
}) => {
  // 样式方法
  const { getPrefixCls } = React.useContext(ConfigContext);

  // 获取 timeline 的样式
  const prefixCls = getPrefixCls('timeline', customizePrefixCls);

  // 整合 class 
  const itemClassName = classNames(
    `${prefixCls}-item`,
    {
      [`${prefixCls}-item-pending`]: pending,
    },
    className,
  );

  // 如果 color 不是 blue|red|green|gray，那么就是自定义
  const customColor = /blue|red|green|gray/.test(color || '') ? undefined : color;

  // 自定义点的样式
  const dotClassName = classNames(`${prefixCls}-item-head`, {
    [`${prefixCls}-item-head-custom`]: !!dot,
    // 不存在自定义颜色使用默认类名
    [`${prefixCls}-item-head-${color}`]: !customColor,
  });

  return (
    <li {...restProps} className={itemClassName}>
      {/* label 部分，存在才展示 */}
      {label && <div className={`${prefixCls}-item-label`}>{label}</div>}
      {/* 虚线部分 */}
      <div className={`${prefixCls}-item-tail`} />
      {/* 点部分 */}
      <div className={dotClassName} style={{ borderColor: customColor, color: customColor }}>
        {dot}
      </div>
      {/* 内容部分 */}
      <div className={`${prefixCls}-item-content`}>{children}</div>
    </li>
  );
};

export default TimelineItem;
```