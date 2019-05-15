import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

export default mergeStyleSets({
  common: {
    selectors: {
      'h1, h2, h3, h4': {
        'margin-bottom': '0px',
        'padding-bottom': '0px',
        // background: 'yellow',
      },
    },
  },

  page: {
    // background: 'lime',
    alignItems: 'center',
  },

  wrapper: {
    // background: 'white',
  },

  group: {
    // background: 'red',
    display: 'flex',
  },

  item: {
    // background: 'cyan',
    'min-width': '160px',
    // display: 'stretch',
    // display: 'flex',
    // flex: '1 0 auto',
    // 'flex-flow': 'row nowrap',
    // alignItems: 'center',
    // justifyContent: 'center',
    // stretch: '1',
  },
});
