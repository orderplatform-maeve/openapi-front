import React, { ReactNode } from 'react';
import { CardTitle, CardTitleProps } from './CardTitle.tsx';
import { CardText, CardTextProps } from './CardText.tsx';
import { CardSubTitle, CardSubTitleProps } from './CardSubTitle.tsx';
import { CardAction, CardActionProps } from './CardAction.tsx';
import styles from './Card.module.css'; // 스타일을 위한 CSS 파일

interface CardProps {
  children: ReactNode;
}

export const Card: React.FC<CardProps> & {
  Title: React.FC<CardTitleProps>;
  SubTitle: React.FC<CardSubTitleProps>;
  Text: React.FC<CardTextProps>;
  Action: React.FC<CardActionProps>;
} = ({ children }: CardProps) => {
  return <div className={styles.container}>{children}</div>;
};

Card.Title = CardTitle;
Card.SubTitle = CardSubTitle;
Card.Text = CardText;
Card.Action = CardAction;
