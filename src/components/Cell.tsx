import React, { FC, MutableRefObject, useEffect, useRef } from 'react';
import { variant } from '../types/ICell';
import classes from '../styles/cell.module.scss';
import { onClick } from './Field';

interface ICellProps {
  x: number;
  y: number;
  variant: variant;
  onClick: onClick;
}

const Cell: FC<ICellProps> = ({ x, y, variant, onClick }) => {
  const cellRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    cellRef.current.classList.remove(
      classes['destroyed'],
      classes['unrevealed'],
      classes['checked'],
      classes['damaged'],
      classes['ship'],
      classes['choosen']
    );
    cellRef.current.classList.add(classes[variant]);
  }, [variant]);
  const click = () => {
    onClick(x, y);
  };
  return <div ref={cellRef} className={classes.cell} onClick={click}></div>;
};

export default Cell;
