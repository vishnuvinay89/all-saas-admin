// components/KaTableComponent.tsx

import React from 'react';
import { ITableProps, Table } from 'ka-table';
import {SortingMode , PagingPosition} from 'ka-table/enums';
import { Paper } from '@mui/material';
import 'ka-table/style.css';

interface KaTableComponentProps {
  columns: ITableProps['columns'];
  data: ITableProps['data'];
}

const KaTableComponent: React.FC<KaTableComponentProps> = ({ columns, data }) => {
  const tableProps: ITableProps = {
    columns,
    data,
    rowKeyField: 'id',
    sortingMode: SortingMode.Single,
    
  };

  return (
    <Paper>
      <Table {...tableProps}
       paging= {{
        enabled: true,
        pageIndex: 0,
        pageSize: 10,
        pageSizes: [5, 10, 15],
        position: PagingPosition.Bottom
    }}
      
      />
    </Paper>
  );
};

export default KaTableComponent;
