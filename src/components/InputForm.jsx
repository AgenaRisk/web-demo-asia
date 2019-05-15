import React from 'react';
import {
  Dropdown, Stack, PrimaryButton,
} from 'office-ui-fabric-react/lib/';

import styles from '../configs/styles';
import tokens from '../configs/tokens';

import calculate from '../util/apis';

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

async function handleSubmit(event, input, setOutput) {
  const sendData = {
    model: 'models/Asia.ast',
    dataSet: {
      observations: input.map(group => group.questions)
        .reduce((a1, a2) => a1.concat(a2))
        .filter(({ selected }) => selected && selected !== '')
        .map(entry => createObservation(entry)),
    },
  };
  const out = await calculate(sendData);
  setOutput(out);
}

export default ({ input, setInput, setOutput }) => {
  const DEFAULT_OPTION = 'Select';

  return (
    <React.Fragment>
      <h2>Inputs</h2>
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
                            handleSubmit({}, input, setOutput); // Optional: auto-calculation makes the submit button redundant
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
          onClick={e => handleSubmit(e, input, setOutput)}
          allowDisabledFocus
        />
      </Stack>
    </React.Fragment>
  );
};
