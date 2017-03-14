import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MultiSelect } from 'react-selectize';

import ProgressBar from './ProgressBar.jsx';
import { loadDefinition, observedWord } from '../action';

const observeDuration = 6000;

class WordCard extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nProps) {
    const { word, observedWord } = this.props;
    if (nProps.word && word !== nProps.word) {
      document.title = `New Tab (${nProps.word})`;
      this.props.loadDefinition(nProps.word);
      this._progressBar && this._progressBar.go(80);
      this._timeoutId = setTimeout(
        () => observedWord(nProps.word),
        observeDuration,
      );
    }
  }

  render() {
    const { entry, word } = this.props;
    if (!word) return null;

    return (
      <div className="word">
        <ProgressBar ref={ref => this._progressBar = ref} />
        <h2 className="word__word">{word}</h2>
        <div className="word__pron-pos">
          <div className="word__pron" />
          <div className="word__pos">{entry.type}</div>
        </div>
        <div className="word__definition">
          {entry.definition || 'loading...'}
        </div>

        {!!entry.example &&
          <div className="word__example">
            {entry.example}
          </div>}
        <div className="word__tags">
          <MultiSelect
            placeholder="Select categories"
            options={['emotion', 'relationship', 'action'].map(fruit => ({
              label: fruit,
              value: fruit,
            }))}
            autoFocus={false}
            maxValues={5}
            onValuesChange={() => {}}
            transitionEnter
            transitionLeave
            createFromSearch={(options, values, search) => {
              const labels = values.map(value => value.label);

              if (
                search.trim().length == 0 || labels.indexOf(search.trim()) != -1
              ) {
                return null;
              }

              return {
                label: search.trim(),
                value: search.trim(),
              };
            }}
          />
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    const { word, entry } = this.props;
    if (entry.definition) {
      document.title = `${word} - ${entry.definition}`;
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeoutId);
  }
}

function mapStateToProps(state, props) {
  console.log(props);
  return {
    entry: state.dictionary[props.word] || {},
  };
}

export default connect(mapStateToProps, {
  loadDefinition,
  observedWord,
})(WordCard);
