import React from 'react';

interface Props {
  message: string;
}

class ErrorMessage extends React.Component<Props> {
  render(): React.ReactNode {
    return <p>{this.props.message}</p>;
  }
}

export default ErrorMessage;
