import React from 'react';

interface State {
  searchTerm: string;
  page: number;
  loading: boolean;
  error: string | null;
}

class App extends React.Component<object, State> {
  state: State = {
    searchTerm: '',
    page: 1,
    loading: false,
    error: null,
  };

  render() {
    return <div>React Class Components Task Started</div>;
  }
}

export default App;