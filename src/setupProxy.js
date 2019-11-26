const menu = require('../menu.json');

const getTreeWithActiveId = activeId => {
  const menuItems = JSON.parse(JSON.stringify(menu));
  const expandBranch = nodeId => {
    const node = menuItems.entities.pages[nodeId];
    if (node) {
      node.isExpanded = true;
      node.parentId && expandBranch(node.parentId);
    }
  };
  const activeAnchor = menuItems.entities.anchors[activeId];
  if (activeAnchor) {
    expandBranch(activeAnchor.parentId);
  } else {
    expandBranch(activeId);
  }
  return menuItems;
};

const getTreeByText = text => {
  const filteredMenuItems = {
    entities: {
      pages: {},
      anchors: {}
    },
    topLevelIds: []
  };
  const addBranch = (nodeId, childId) => {
    const filteredNode = filteredMenuItems.entities.pages[nodeId];
    if (filteredNode) {
      filteredNode.isExpanded = true;
      if (!filteredNode.pages.includes(childId)) {
        filteredNode.pages.push(childId);
      }
    } else {
      const node = menu.entities.pages[nodeId];
      filteredMenuItems.entities.pages[nodeId] = {
        ...node,
        isExpanded: true,
        pages: [childId]
      };
      node.anchors &&
        node.anchors.forEach(anchorId => {
          filteredMenuItems.entities.anchors[anchorId] =
            menu.entities.anchors[anchorId];
        });
      if (node.parentId) {
        addBranch(node.parentId, node.id);
      }
    }
  };
  const getLevelBranches = level => {
    return Object.values(menu.entities.pages).forEach(item => {
      if (
        item.level === level &&
        item.title.toLowerCase() === text.toLowerCase() &&
        !filteredMenuItems.entities.pages[item.id]
      ) {
        filteredMenuItems.entities.pages[item.id] = { ...item, pages: [] };
        item.anchors &&
          item.anchors.forEach(anchorId => {
            filteredMenuItems.entities.anchors[anchorId] =
              menu.entities.anchors[anchorId];
          });
        if (item.parentId) {
          addBranch(item.parentId, item.id);
        }
      }
    });
  };

  let level = 5;
  while (level + 1) {
    getLevelBranches(level);
    level--;
  }
  filteredMenuItems.topLevelIds = menu.topLevelIds.filter(
    id => filteredMenuItems.entities.pages[id]
  );
  return filteredMenuItems;
};

module.exports = function(app) {
  app.get('/json', (req, res) => {
    setTimeout(() => {
      if (req.query.ID) {
        res.json(getTreeWithActiveId(req.query.ID));
      } else if (req.query.text && req.query.text.length) {
        res.json(getTreeByText(req.query.text));
      } else {
        res.json(menu);
      }
    }, 3000);
  });
};
