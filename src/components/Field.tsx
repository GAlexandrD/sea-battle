import React, { FC, MutableRefObject, useEffect, useRef } from 'react';
import { ICell } from '../types/ICell';
import classes from '../styles/field.module.scss';
import Cell from './Cell';

export type onClick = (x: number, y: number) => void;

interface FieldProps {
  cells: ICell[][];
  onClick: onClick;
  movingSide?: boolean;
}

const FieldComponent: FC<FieldProps> = ({ cells, onClick, movingSide }) => {
  const fieldRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    if (movingSide === undefined) return;
    if (movingSide) {
      fieldRef.current.classList.add(classes.inActive);
    } else {
      fieldRef.current.classList.remove(classes.inActive);
    }
  }, [movingSide]);
  return (
    <div ref={fieldRef} className={classes.field}>
      {cells.map((row, i) => (
        <div key={i} className={classes.row}>
          {row.map((cell) => (
            <Cell key={`${cell.x}${cell.y}`} {...cell} onClick={onClick}></Cell>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FieldComponent;
