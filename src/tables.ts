const TABLE_HEADER_ROW = 0;

const getTableColumnByHeader = (table: TableDataType[][], headerKey: string) => {
  const tableHeaders = table[TABLE_HEADER_ROW];
  for(let i = 0; i < tableHeaders.length; i++){
    if(tableHeaders[i] === headerKey){
      return i;
    }
  }
  return null;
}

const getTableRowsByHeader =  (table: TableDataType[][], headerKey: string) => {
  const tableColumn = getTableColumnByHeader(table, headerKey);
  if(tableColumn === null){
    return null;
  }
  if(table[0].length < tableColumn) {
    return null;
  }
  return table.map(columns => columns[tableColumn]);
}
