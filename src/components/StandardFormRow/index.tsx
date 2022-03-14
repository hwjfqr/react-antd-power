import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

type StandardFormRowProps = {
  last?: boolean;
  block?: boolean;
  style?: React.CSSProperties;
};

const StandardFormRow: React.FC<StandardFormRowProps> = ({
  last,
  block,
  children,
  ...rest
}) => {
  const cls = classNames(styles.standardFormRow, {
    [styles.standardFormRowBlock]: block,
    [styles.standardFormRowLast]: last,
  });

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
};

export default StandardFormRow;
