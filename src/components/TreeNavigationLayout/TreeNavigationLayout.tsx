import React from 'react';
import './TreeNavigationLayout.scss';

export interface TreeNavigationLayoutProps {
  menu: JSX.Element,
  content: JSX.Element
}

const TreeNavigationLayout = ({menu, content}: TreeNavigationLayoutProps) => {
  return (
    <div className="tree-navigation-layout">
      <div className='tree-navigation-layout__menu-container'>
        {menu}
      </div>
      <div className='tree-navigation-layout__content-container'>
        {content}
      </div>
    </div>);
};

export default TreeNavigationLayout;
