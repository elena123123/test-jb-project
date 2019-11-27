import React, { useState, useEffect } from 'react';
import { requestMenuItems } from '../../api/navigationMenu';
import TreeNavigation from '../TreeNavigation/TreeNavigation';
import DebouncedSearchInput from '../DebouncedSearchInput/DebouncedSearchInput';
import useFetch from '../../customHooks/useFetch';
import ListLoading from '../ListLoading/ListLoading';
import './SearchableTreeNavigation.scss';

export interface StringTMap<T> {
  [key: string]: T;
}

const initialMenu = {
  entities: {
    pages: {},
    anchors: {}
  },
  topLevelIds: []
};

export interface MenuItem {
  id: string;
  parentId?: string;
  level: number;
  title: string;
  url: string;
  pages?: string[];
  anchors?: string[];
  tabIndex?: number;
  isExpanded?: boolean;
}

export interface MenuItems {
  entities: {
    pages: StringTMap<MenuItem>;
    anchors: StringTMap<MenuItem>;
  };
  topLevelIds: string[];
}

const SearchableTreeMenu: React.FC = () => {
  const [text, setText] = useState('');
  const [activeId, setActiveId] = useState('touroftheUI');
  const [menuItems, menuItemsLoading, menuItemsError] = useFetch(
    requestMenuItems,
    { params: { text, activeId } },
    [text],
    initialMenu
  );

  useEffect(() => {
    if (text) {
      setActiveId('');
    }
  }, [text]);
  const renderTree = () => {
    if (menuItemsLoading) {
      return <ListLoading />;
    } else if (menuItemsError) {
      return <div>Error</div>;
    } else {
      return <TreeNavigation items={menuItems} activeId={activeId} />;
    }
  };

  return (
    <div className="searchable-tree-menu">
      <div className="searchable-tree-menu__search-input">
        <DebouncedSearchInput onDebouncedTextChange={setText} />
      </div>
      {renderTree()}
    </div>
  );
};

export default SearchableTreeMenu;
