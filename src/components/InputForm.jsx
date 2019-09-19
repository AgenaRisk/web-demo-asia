import React from 'react';
import {
  Dropdown, Stack, PrimaryButton, Toggle, TextField,
} from 'office-ui-fabric-react/lib/';

import styles from '../configs/styles';
import tokens from '../configs/tokens';

import calculate from '../util/apis';

import defModel from '../configs/defaultModel.json';

function createObservation({ node, network, selected }) {
  return {
    node,
    entries: [
      {
        weight: 1,
        value: selected,
      },
    ],
    network,
  };
}

async function handleSubmit(event, input, setOutput, override, overrideContent) {
  const sendData = {
    dataSet: {
      observations: input.map(group => group.questions)
        .reduce((a1, a2) => a1.concat(a2))
        .filter(({ selected }) => selected && selected !== '')
        .map(entry => createObservation(entry)),
    },
  };

  if (override){
    try {
      const modelJson = JSON.parse(overrideContent); 
      sendData.model = modelJson;
    }
    catch (parseError){
      return false;
    }
  }
  else {
    sendData.modelPath = 'models/Asia.ast';
  }

  const out = await calculate(sendData);

  console.log(out);

  if (out.status === "failure"){
    alert(out.message);
    return false;
  }

  if (out.status === 500){
    alert("Internal Server Error");
    return false;
  }

  if (!out.results) {
    out.results = [];
  }

  setOutput(out);
}

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showJsonOverride: false,
      modelJson: defModel.text
    };

    this._toggleShowJsonOverride.bind(this);
    this._getErrorMessage.bind(this);
  }

  _toggleShowJsonOverride = () => {
    var newValue = !this.state.showJsonOverride;
    this.setState({
      showJsonOverride: newValue
    });
  }

  _getErrorMessage = (value) => {

    this.setState({
      modelJson: value
    });

    try {
      JSON.parse(value);
    }
    catch(parseError){
      return `Can't parse as a JSON`;
    }

    return  '';
  };

  render() {
    const DEFAULT_OPTION = 'Select';
    const { input, setInput, setOutput } = this.props;

    return (
      <React.Fragment>
        <h2>Inputs</h2>
        <Toggle label="Override model with custom JSON" inlineLabel checked={this.state.showJsonOverride} onChange={this._toggleShowJsonOverride} />
        {this.state.showJsonOverride && (
          <Stack vertical className={styles.group}>
            <TextField
              label="Override model with this JSON"
              multiline
              autoAdjustHeight
              onGetErrorMessage={this._getErrorMessage}
              validateOnFocusIn
              validateOnFocusOut
              value={this.state.modelJson}
              description="Valid JSON of the model to calculate"
             />
          </Stack>
        )}
        {
          input.map(({ name, questions }, groupdId) => (
            <Stack vertical className={styles.group} key={name}>

              <h4>{name}</h4>

              <Stack horizontal className={styles.groupRow} tokens={tokens.itemSpacing}>
                {
                  questions.map((question, questionId) => {
                    const {
                      label, network, node, selected, options,
                    } = question;
                    const labelText = `${label} (${network}.${node})`;
                    return (
                      <Stack.Item grow className={styles.item} key={labelText}>
                        <Dropdown
                          label={labelText}
                          placeholder={DEFAULT_OPTION}
                          defaultSelectedKey={selected}
                          options={[{ key: '', text: DEFAULT_OPTION }, ...options.map(key => ({ key, text: key }))]}
                          onChange={(event, item) => {
                            const inputUpdated = [...input];
                            inputUpdated[groupdId].questions[questionId].selected = item.key;
                            setInput(inputUpdated);
                            handleSubmit({}, input, setOutput, this.state.showJsonOverride, this.state.modelJson); // Optional: auto-calculation makes the submit button redundant
                          }}
                        />
                      </Stack.Item>
                    );
                  })
                }
              </Stack>
            </Stack>
          ))
        }
        <Stack vertical className={styles.group}>
          <PrimaryButton
            text="Calculate"
            onClick={e => handleSubmit(e, input, setOutput, this.state.showJsonOverride, this.state.modelJson)}
            allowDisabledFocus
          />
        </Stack>
      </React.Fragment>
    );
  }
}
export default InputForm;