import React, { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  StringTMap,
  MenuItems,
  MenuItem
} from '../SearchableTreeNavigation/SearchableTreeNavigation';
import AnimateHeight from 'react-animate-height';
import { ReactComponent as ExpandIcon } from '../../img/arrow.svg';
import './TreeNavigation.scss';

export interface TreeNavigationProps {
  items: MenuItems;
  activeId: string;
}

export interface NodeProps {
  node: MenuItem;
  onTitleClick: Function;
  onExpandClick?: Function;
  isBranchSelected: boolean;
  isNodeSelected: boolean;
  treeLevel: number;
}

const Node = ({
  node,
  onTitleClick,
  onExpandClick = () => {},
  isBranchSelected,
  isNodeSelected,
  treeLevel
}: NodeProps) => {
  const { id, title, pages = [], isExpanded = false } = node;
  const hasChildren = pages.length;
  return (
    <div
      className={classNames({
        'nav-tree__node': true,
        'nav-tree__node_selected': isBranchSelected,
        ['level-' + treeLevel]: true
      })}
    >
      <span
        className={classNames({
          'nav-tree__title': true,
          'nav-tree__title_selected': isNodeSelected
        })}
      >
        {hasChildren ? (
          <div
            className={classNames({
              'expand-button': true,
              'expand-button_opened': isExpanded
            })}
            onClick={() => onExpandClick(id)}
          >
            <ExpandIcon />
          </div>
        ) : null}
        <span onClick={() => onTitleClick(id)}>{title}</span>
      </span>
    </div>
  );
};

const TreeNavigation = ({ items, activeId }: TreeNavigationProps) => {
  const [treeNodes, setTreeNodes] = useState(items);
  const [selectedId, setSelectedId] = useState(activeId);

  useEffect(() => {
    setTreeNodes(items);
  }, [items]);

  const isBranchSelected = useCallback(
    (node: MenuItem) => {
      const { anchors, id } = node;
      return selectedId === id || (anchors && anchors.includes(selectedId));
    },
    [selectedId]
  );

  const buildNode = useCallback(
    (node: MenuItem) => {
      const { pages = [], isExpanded = false } = node;
      const hasChildren = pages.length;
      const menuPages = treeNodes.entities.pages;
      const anchors = treeNodes.entities.anchors;

      const expandBranch = (id: string) => {
        const nodes = Object.assign({}, treeNodes);
        nodes.entities.pages[id].isExpanded = !nodes.entities.pages[id]
          .isExpanded;
        setTreeNodes(nodes);
      };
      return (
        <li key={node.id}>
          <Node
            node={node}
            isBranchSelected={isBranchSelected(node) || false}
            isNodeSelected={node.id === selectedId}
            onTitleClick={(id: string) => {
              setSelectedId(id);
              !isExpanded && expandBranch(id);
            }}
            onExpandClick={(id: string) => {
              expandBranch(id);
            }}
            treeLevel={node.level}
          />
          {node.anchors ? (
            <AnimateHeight
              duration={500}
              height={isBranchSelected(node) ? 'auto' : 0}
            >
              <ul className="nav-tree__block">
                {node.anchors.map(anchorId => (
                  <li key={anchorId}>
                    <Node
                      node={anchors[anchorId]}
                      onTitleClick={(id: string) => setSelectedId(id)}
                      isNodeSelected={anchors[anchorId].id === selectedId}
                      isBranchSelected={true}
                      treeLevel={node.level + 1}
                    />
                  </li>
                ))}
              </ul>
            </AnimateHeight>
          ) : null}
          {hasChildren ? (
            <AnimateHeight duration={500} height={isExpanded ? 'auto' : 0}>
              <ul className="nav-tree__block">
                {pages.map(id => buildNode(menuPages[id]))}
              </ul>
            </AnimateHeight>
          ) : null}
        </li>
      );
    },
    [treeNodes, selectedId, isBranchSelected]
  );

  const buildTree = useCallback(() => {
    const menuPages = treeNodes.entities.pages as StringTMap<MenuItem>;
    return (
      <ul className="nav-tree__block">
        {treeNodes.topLevelIds.map(id => buildNode(menuPages[id]))}
      </ul>
    );
  }, [treeNodes, buildNode]);

  return <div className="nav-tree">{buildTree()}</div>;
};

export default TreeNavigation;
