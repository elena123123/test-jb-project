import React from 'react';
import TreeNavigationLayout from './TreeNavigationLayout/TreeNavigationLayout';
import SearchableTreeNavigation from './SearchableTreeNavigation/SearchableTreeNavigation';

import './App.scss';

const Content: React.FC = () => {
  return <div>Content</div>;
};

const App: React.FC = () => {
  return (
    <div className="app">
      <TreeNavigationLayout
        content={<Content />}
        menu={<SearchableTreeNavigation />}
      />
    </div>
  );
};

export default App;
