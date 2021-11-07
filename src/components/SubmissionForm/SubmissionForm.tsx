import React from 'react';

abstract class SubmissionForm extends React.Component {
  abstract replaceEditorContent (body: string): void;
}

export default SubmissionForm;
