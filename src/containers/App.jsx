import React, { useState } from 'react';
import {
  Stack,
} from 'office-ui-fabric-react/lib/';
import { initializeIcons } from '@uifabric/icons';

import styles from '../configs/styles';
import tokens from '../configs/tokens';

import ResultTable from '../components/ResultTable';
import InputForm from '../components/InputForm';

import defInput from '../configs/defaultInput.json';

initializeIcons();

const App = () => {
  const [output, setOutput] = useState({ results: [] });
  const [input, setInput] = useState(defInput);

  return (
    <Stack vertical className={[styles.page, styles.common]} tokens={tokens.spacingBetweenGroups}>
      <Stack vertical className={styles.wrapper} tokens={tokens.spacingBetweenGroups}>
        <Stack vertical className={styles.group}>
          <h1>Demo Asia Form</h1>
        </Stack>
        <InputForm input={input} setInput={setInput} setOutput={setOutput} />
        <ResultTable output={output} />
      </Stack>
    </Stack>
  );
};

export default App;
