import React, { ReactNode, PropsWithChildren } from 'react';
import { CardTitle } from './CardTitle.tsx';
import { CardText } from './CardText.tsx';
import { CardSubTitle } from './CardSubTitle.tsx';
import { CardAction } from './CardAction.tsx';
import styles from './Card.module.css'; // 스타일을 위한 CSS 파일

interface CardProps {
  children: ReactNode;
}

export const Card: React.FC<CardProps> & {
  Title: React.FC<PropsWithChildren>;
  SubTitle: React.FC<PropsWithChildren>;
  Text: React.FC<PropsWithChildren>;
  Action: React.FC<PropsWithChildren>;
} = ({ children }: CardProps) => {
  return <div className={styles.container}>{children}</div>;
};

Card.Title = CardTitle;
Card.SubTitle = CardSubTitle;
Card.Text = CardText;
Card.Action = CardAction;
