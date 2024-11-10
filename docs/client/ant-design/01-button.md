# Button
## 主文件
```tsx
/* eslint-disable react/button-has-type */
import React, { Children, createRef, useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
// 将对象中某些属性剔除
import omit from 'rc-util/lib/omit';
// 将二个 ref 合并在一起的方法
import { composeRef } from 'rc-util/lib/ref';
// 开发环境的使用的警告的函数
import { devUseWarning } from '../_util/warning';
// 事件处理方法
import Wave from '../_util/wave';
// 获取挂载在全局的方法
import { ConfigContext } from '../config-provider';
// 全局配置中的 disabled 配置
import DisabledContext from '../config-provider/DisabledContext';
// 获取全局&组件size配置，返回size结果
import useSize from '../config-provider/hooks/useSize';
// size 类型
import type { SizeType } from '../config-provider/SizeContext';
// 根据 前缀和方向，返回紧凑布局方向的 size 和 className
import { useCompactItemContext } from '../space/Compact';
// 按钮组，组件
import Group, { GroupSizeContext } from './button-group';
// 按钮形状，按钮类型枚举
import type { ButtonHTMLType, ButtonShape, ButtonType } from './buttonHelpers';
// 是否是二个中文，是否为text、link类型，将children进行空格处理
import { isTwoCNChar, isUnBorderedButtonType, spaceChildren } from './buttonHelpers';
// 处理 icon 样式的容器组件
import IconWrapper from './IconWrapper';
// loading icon
import LoadingIcon from './LoadingIcon';
// style hook 中的，全局变量、类名、hashId
import useStyle from './style';
// 混入紧凑型样式
import CompactCmp from './style/compactCmp';

export type LegacyButtonType = ButtonType | 'danger';

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  shape?: ButtonShape;
  size?: SizeType;
  disabled?: boolean;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  children?: React.ReactNode;
  [key: `data-${string}`]: string;
  classNames?: { icon: string };
  styles?: { icon: React.CSSProperties };
}

type MergedHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLElement> &
    React.ButtonHTMLAttributes<HTMLElement> &
    React.AnchorHTMLAttributes<HTMLElement>,
  'type'
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  href?: string;
  htmlType?: ButtonHTMLType;
  autoInsertSpace?: boolean;
}

type LoadingConfigType = {
  loading: boolean;
  delay: number;
};

/**
 * 根据delay，处理 loading 配置，
 * @param loading 
 * @returns 
 */
function getLoadingConfig(loading: BaseButtonProps['loading']): LoadingConfigType {
  if (typeof loading === 'object' && loading) {
    let delay = loading?.delay;
    // 如果传了 delay，并且 类型为 number，那么使用 delay 否则 0
    delay = !Number.isNaN(delay) && typeof delay === 'number' ? delay : 0;
    return {
      loading: delay <= 0,
      delay,
    };
  }

  return {
    loading: !!loading,
    delay: 0,
  };
}

const InternalCompoundedButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    loading = false,
    prefixCls: customizePrefixCls,
    type,
    danger = false,
    shape = 'default',
    size: customizeSize,
    styles,
    disabled: customDisabled,
    className,
    rootClassName,
    children,
    icon,
    iconPosition = 'start',
    ghost = false,
    block = false,
    // React does not recognize the `htmlType` prop on a DOM element. Here we pick it out of `rest`.
    htmlType = 'button',
    classNames: customClassNames,
    style: customStyle = {},
    autoInsertSpace,
    ...rest
  } = props;

  // https://github.com/ant-design/ant-design/issues/47605
  // Compatible with original `type` behavior
  // button 类型，没有则使用默认的
  const mergedType = type || 'default';

  // 获取挂载在全局的方法
  const { getPrefixCls, direction, button } = useContext(ConfigContext);

  // 是否需要 间隙
  const mergedInsertSpace = autoInsertSpace ?? button?.autoInsertSpace ?? true;

  // css 前缀
  const prefixCls = getPrefixCls('btn', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // 全局配置中读取 是否禁用
  const disabled = useContext(DisabledContext);
  // 先判断 组件是否有 disabled，然后在判断 全局的是否有 disabled
  const mergedDisabled = customDisabled ?? disabled;

  // 获取 组件的 config 配置 返回元素间隔大小
  const groupSize = useContext(GroupSizeContext);

  // loading 是否延时
  const loadingOrDelay = useMemo<LoadingConfigType>(() => getLoadingConfig(loading), [loading]);

  // 控制 loading 变量 
  const [innerLoading, setLoading] = useState<boolean>(loadingOrDelay.loading);

  // 判断是否有二个汉子
  const [hasTwoCNChar, setHasTwoCNChar] = useState<boolean>(false);

  // createRef 创建一个 ref 对象，该对象可以包含任意值。
  const internalRef = createRef<HTMLButtonElement | HTMLAnchorElement>();

  // 将二个 ref 对象组合在一起
  const buttonRef = composeRef(ref, internalRef);

  // 只有一个子元素，并且没有 icon 并且 type 不等于 text or link 类型
  const needInserted =
    Children.count(children) === 1 && !icon && !isUnBorderedButtonType(mergedType);

  // 根据 loadingOrDelay 判断 loading 是否延时加载 
  useEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    if (loadingOrDelay.delay > 0) {
      delayTimer = setTimeout(() => {
        delayTimer = null;
        setLoading(true);
      }, loadingOrDelay.delay);
    } else {
      setLoading(loadingOrDelay.loading);
    }

    function cleanupTimer() {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
    }

    return cleanupTimer;
  }, [loadingOrDelay]);

  // 设置 hasTwoCNChar 状态
  useEffect(() => {
    // FIXME: for HOC usage like <FormatMessage />
    if (!buttonRef || !(buttonRef as any).current || !mergedInsertSpace) {
      return;
    }
    const buttonText = (buttonRef as any).current.textContent;
    // 如果 需要插入，并且有二个文字
    if (needInserted && isTwoCNChar(buttonText)) {
      // hasTwoCNChar 为 false 时，将 hasTwoCNChar 状态修改为 true
      if (!hasTwoCNChar) {
        setHasTwoCNChar(true);
      }
    } else if (hasTwoCNChar) {
      setHasTwoCNChar(false);
    }
  }, [buttonRef]);

  // 按钮点击事件
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick } = props;
    // FIXME: https://github.com/ant-design/ant-design/issues/30207
    // 如果当前是 loading || disabled 状态，那么 return 掉
    if (innerLoading || mergedDisabled) {
      e.preventDefault();
      return;
    }
    // 否则调用 props 传进来的 click 事件
    (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e);
  };

  // 如果不是线上环境，那么要对 按钮配置 进行校验
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Button');

    warning(
      !(typeof icon === 'string' && icon.length > 2),
      'breaking',
      `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`,
    );

    // link 和 text 类型不用使用 幽灵 按钮属性
    warning(
      !(ghost && isUnBorderedButtonType(mergedType)),
      'usage',
      "`link` or `text` button can't be a `ghost` button.",
    );
  }

  // 传入 css类名 和 全局配置中的布局方向，返回 公共的 size 和 className
  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);

  // 默认的配置
  const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };

  // props.size -> 全局size -> 组件级别size -> useSize中默认的size，返回判断后的 size
  const sizeFullName = useSize((ctxSize) => customizeSize ?? compactSize ?? groupSize ?? ctxSize);

  // 如果设置了 size 配置，则使用设置的 size
  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName] || '' : '';

  // 如果当前是 loading 状态，则使用 loading 的，否则就用设置的
  const iconType = innerLoading ? 'loading' : icon;

  // ...rest接受其余的配置后，剔除 navigate 属性
  const linkButtonRestProps = omit(rest as ButtonProps & { navigate: any }, ['navigate']);

  // 整合css样式
  const classes = classNames(
    prefixCls,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
      [`${prefixCls}-${mergedType}`]: mergedType,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(mergedType),
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && mergedInsertSpace && !innerLoading,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-dangerous`]: danger,
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-icon-end`]: iconPosition === 'end',
    },
    compactItemClassnames,
    className,
    rootClassName,
    button?.className,
  );

  // 将 全局按钮的样式 和 用户props传来的style 合并
  const fullStyle: React.CSSProperties = { ...button?.style, ...customStyle };

  // 将用户设置的className 和 全局的设置的className 合并
  const iconClasses = classNames(customClassNames?.icon, button?.classNames?.icon);

  // 将用户设置的icon的style 与 全局icon的style 合并
  const iconStyle: React.CSSProperties = {
    ...(styles?.icon || {}),
    ...(button?.styles?.icon || {}),
  };

  // 渲染的icon，如果用户传了 props.icon并且 loading不是true，则使用用户的 icon
  // 否则使用 loading 的 icon
  const iconNode =
    icon && !innerLoading ? (
      <IconWrapper prefixCls={prefixCls} className={iconClasses} style={iconStyle}>
        {icon}
      </IconWrapper>
    ) : (
      <LoadingIcon existIcon={!!icon} prefixCls={prefixCls} loading={innerLoading} />
    );

  // 处理后的 children 内容
  const kids = 
    children || children === 0 ? spaceChildren(children, needInserted && mergedInsertSpace) : null;

  // href 为 true，则使用 a 标签
  if (linkButtonRestProps.href !== undefined) {
    return wrapCSSVar(
      <a
        {...linkButtonRestProps}
        className={classNames(classes, {
          [`${prefixCls}-disabled`]: mergedDisabled,
        })}
        href={mergedDisabled ? undefined : linkButtonRestProps.href}
        style={fullStyle}
        onClick={handleClick}
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        tabIndex={mergedDisabled ? -1 : 0}
      >
        {iconNode}
        {kids}
      </a>,
    );
  }

  // 默认按钮 node 节点
  let buttonNode = (
    <button
      {...rest}
      type={htmlType}
      className={classes}
      style={fullStyle}
      onClick={handleClick}
      disabled={mergedDisabled}
      ref={buttonRef as React.Ref<HTMLButtonElement>}
    >
      {iconNode}
      {kids}
      {/* Styles: compact */}
      {!!compactItemClassnames && <CompactCmp key="compact" prefixCls={prefixCls} />}
    </button>
  );

  // 如果当前text或link类型，使用 wave
  if (!isUnBorderedButtonType(mergedType)) {
    buttonNode = (
      <Wave component="Button" disabled={innerLoading}>
        {buttonNode}
      </Wave>
    );
  }
  return wrapCSSVar(buttonNode);
});

type CompoundedComponent = typeof InternalCompoundedButton & {
  Group: typeof Group;
  /** @internal */
  __ANT_BUTTON: boolean;
};

const Button = InternalCompoundedButton as CompoundedComponent;

Button.Group = Group;
Button.__ANT_BUTTON = true;

if (process.env.NODE_ENV !== 'production') {
  Button.displayName = 'Button';
}

export default Button;

```