import React from 'react';
import './repo-table.css'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import LoadingAnimation from "../components/loadingAnimation";

interface Column {
  id: 'name' | 'stargazers_count' | 'forks';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: 'Repository name', minWidth: 170 },
  {
    id: 'stargazers_count',
    label: 'Stars',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'forks',
    label: 'Forks',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

interface Data {
  id: number;
  name: string;
  html_url: string;
  stargazers_count: number;
  forks: number;
}

function createData(id: number, name: string, html_url: string, stargazers_count: number, forks: number): Data {
  return { id, name, html_url, stargazers_count, forks };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    border: '1px solid black',
    boxSizing: 'border-box',
    borderRadius: '20px',
  },
  container: {
    maxHeight: 440,
  },
});

export interface Props {
  onSearchChange?: (username: string) => void;
}

export default function RepoTable(props: Props) {
  const classes = useStyles();
  const [search, setSearch] = React.useState('reactjs');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if( event.key === 'Enter' ){ 
      const target = event.target as HTMLInputElement;
      if (target) {
        setSearch(target.value);
        if (props.onSearchChange) {
          props.onSearchChange(target.value);
        }
      }
      setPage(0);
    }
  };

  const fetchAPI = React.useCallback(async () => {
    setIsLoading(true);
    try {
      let response = await fetch(`https://api.github.com/search/repositories?q=${search}`);
      const responseJson = await response.json();
      
      let data = [];
      for (let repo of responseJson.items) {
        data.push(createData(repo.id, repo.name, repo.html_url, repo.stargazers_count, repo.forks));
      }
      setRows(data)
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [search])

  React.useEffect(() => {
    
      fetchAPI()
    
  }, [fetchAPI])

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <LoadingAnimation />
      </div>
    );
  }
  return (
    <div className="table-wrapper">

   
      <Paper className={classes.root}>
        <input
            data-testid="search-input"
            className="search-input"
            type="text"
            onKeyDown={handleSearchChange}
            placeholder="Search repositories ..."
          />
          
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                //key={row.name}
                <TableRow hover role="checkbox" tabIndex={-1}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    if (column.id === 'name') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <a href={row.html_url}>{column.format && typeof value === 'number' ? column.format(value) : value}</a>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    }
                    
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
