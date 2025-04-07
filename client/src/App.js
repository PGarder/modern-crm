import IntegrationManager from './components/Integrations/IntegrationManager';

function App() {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex' }}>
                    <Sidebar />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <Routes>
                            <Route path="/integrations" element={<IntegrationManager />} />
                        </Routes>
                    </Box>
                </Box>
            </ThemeProvider>
        </Router>
    );
}

export default App; 