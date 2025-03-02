import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { mockDashboardData } from '../services/dashboardService';

// Mock data for contracts - in a real app you would fetch this from an API
const MOCK_CONTRACTS = [
  ...mockDashboardData.recentContracts,
  { id: "con5", tenant: "Maria Garcia", apartment: "Urban Studio", startDate: "2023-04-01", endDate: "2024-03-31", status: "active" },
  { id: "con6", tenant: "David Lee", apartment: "Cozy 1BR", startDate: "2023-05-15", endDate: "2024-05-14", status: "active" },
  { id: "con7", tenant: "Jennifer Wilson", apartment: "Family Home", startDate: "2023-01-01", endDate: "2023-07-01", status: "expired" },
  { id: "con8", tenant: "Michael Brown", apartment: "Luxury Studio", startDate: "2023-06-01", endDate: "2024-05-31", status: "pending" },
  { id: "con9", tenant: "Lisa Taylor", apartment: "Penthouse Suite", startDate: "2023-06-15", endDate: "2024-06-14", status: "draft" },
  { id: "con10", tenant: "Thomas Anderson", apartment: "Garden Apartment", startDate: "2023-07-01", endDate: "2024-06-30", status: "pending" },
];

// Status color mapping
const statusColors = {
  active: 'success',
  pending: 'warning',
  expired: 'error',
  draft: 'default'
};

const Contracts = () => {
  const { t } = useTranslation(['common', 'contracts']);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    const fetchContracts = async () => {
      try {
        // In a real app, this would be an API call
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setContracts(MOCK_CONTRACTS);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Apply filters
  const filteredContracts = contracts.filter(contract => {
    // Apply search filter
    const matchesSearch = 
      contract.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {t('contracts:title', 'Contracts')}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => console.log('Add new contract')}
        >
          {t('contracts:actions.create_new', 'Create New')}
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
          <TextField
            label={t('common:actions.search', 'Search')}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>{t('contracts:filters.status', 'Status')}</InputLabel>
            <Select
              value={statusFilter}
              label={t('contracts:filters.status', 'Status')}
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">{t('common:filters.all', 'All')}</MenuItem>
              <MenuItem value="active">{t('contracts:status.active', 'Active')}</MenuItem>
              <MenuItem value="pending">{t('contracts:status.pending', 'Pending')}</MenuItem>
              <MenuItem value="expired">{t('contracts:status.expired', 'Expired')}</MenuItem>
              <MenuItem value="draft">{t('contracts:status.draft', 'Draft')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredContracts.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 5 }}>
            <Typography variant="h6" color="text.secondary">
              {t('contracts:no_results', 'No contracts match your filters')}
            </Typography>
            <Button 
              sx={{ mt: 2 }} 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              {t('common:actions.clear_filters', 'Clear Filters')}
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('contracts:table.contract_id', 'Contract ID')}</TableCell>
                    <TableCell>{t('contracts:table.tenant', 'Tenant')}</TableCell>
                    <TableCell>{t('contracts:table.apartment', 'Apartment')}</TableCell>
                    <TableCell>{t('contracts:table.start_date', 'Start Date')}</TableCell>
                    <TableCell>{t('contracts:table.end_date', 'End Date')}</TableCell>
                    <TableCell>{t('contracts:table.status', 'Status')}</TableCell>
                    <TableCell align="right">{t('contracts:table.actions', 'Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredContracts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((contract) => (
                      <TableRow key={contract.id} hover>
                        <TableCell component="th" scope="row">
                          {contract.id}
                        </TableCell>
                        <TableCell>{contract.tenant}</TableCell>
                        <TableCell>{contract.apartment}</TableCell>
                        <TableCell>{formatDate(contract.startDate)}</TableCell>
                        <TableCell>{formatDate(contract.endDate)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={t(`contracts:status.${contract.status}`, contract.status)}
                            color={statusColors[contract.status]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => console.log(`View contract ${contract.id}`)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredContracts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={t('common:table.rows_per_page', 'Rows per page:')}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Contracts; 