import React from 'react';
import { mergeStyleSets, DefaultPalette } from '@uifabric/styling';
import {
  Stack,
} from 'office-ui-fabric-react/lib/';
import defOutput from '../configs/defaultOutput.json';

const oStyle = mergeStyleSets({
  commonLabel: {
    overflow: 'hidden',
    'white-space': 'nowrap',
  },
  item: {
    background: DefaultPalette.neutralLighter,
    'padding-bottom': '5px',
  },
  itemName: {
    color: DefaultPalette.themeDark,
  },
  itemRow: {
    // background: 'red',
    padding: '2px 0',
    // background: DefaultPalette.themeLighterAlt,
    background: 'white',
  },
  itemRowLabel: {
    // background: 'cyan',
    width: '25%',
    padding: '5px 5px 5px 0',
    'text-align': 'right',
    'font-weight': 'bold',
  },
  itemRowValueText: {
    width: '20%',
    padding: '5px 0 5px 5px',
    'text-align': 'left',
    'font-weight': 'bold',
  },
  itemRowValueGraph: {
    // background: 'lime',
    selectors: {
      span: {
        display: 'inline-block',
        padding: '5px 15px',
        background: DefaultPalette.themePrimary,
        color: 'white',
      },
    },
  },
});

const ResultTable = ({ output }) => (
  <React.Fragment>
    <h2>Predictions</h2>

    {
      output.resultBody.reduce((filtered, item) => {
        // Check against the output definition and only keep items listed
        // As we have to iterate over both array of results and array of items to show, use reduce with accumulated array
        // As we decide to keep a result item, also copy the label text from the listed item into the result for rendering
        defOutput.forEach((listedElement) => {
          if (listedElement.network === item.network && listedElement.node === item.node) {
            filtered.push({ ...item, labelText: listedElement.label });
          }
        });
        return filtered;
      }, [])
        // Keep rendering code separate from filtering for maintanability
        .map(({
          node, resultValues, network, labelText,
        }) => {
          const labelId = `${labelText} (\`${network}\`.\`${node}\`)`;

          return (
            <Stack vertical key={labelId} className={oStyle.item}>
              <Stack horizontal className={oStyle.itemName}>
                <h5>{labelId}</h5>
              </Stack>
              {resultValues && resultValues.map(({ label, value }) => {
                const roundedValue = Math.round(Math.round(value * 1000000) / 10000);

                return (
                  <Stack horizontal className={oStyle.itemRow} key={label}>
                    <Stack.Item className={[oStyle.itemRowLabel, oStyle.commonLabel]} grow={0}>
                      {label}
                    </Stack.Item>

                    <Stack.Item className={[oStyle.itemRowValueGraph, oStyle.commonLabel]} grow={3}>
                      <span style={{ width: `${roundedValue}%` }}>&nbsp;</span>
                    </Stack.Item>

                    <Stack.Item className={[oStyle.itemRowValueText, oStyle.commonLabel]} grow={0}>
                      {`${roundedValue}%`}
                    </Stack.Item>
                  </Stack>
                );
              })}
            </Stack>
          );
        })}
  </React.Fragment>
);

export default ResultTable;
