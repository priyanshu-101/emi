import React, { useState } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';


const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.3s, color 0.3s;
    margin: 0;
  }
`;

const lightTheme = {
  background: '#f9f9f9',
  text: '#000',
  formBackground: '#fff',
  boxBackground: '#e9ecef',
  borderColor: '#ccc',
  buttonBackground: '#007bff',
  buttonHover: '#0056b3',
  errorColor: 'red'
};

const darkTheme = {
  background: '#333',
  text: '#f9f9f9',
  formBackground: '#444',
  boxBackground: '#555',
  borderColor: '#666',
  buttonBackground: '#007bff',
  buttonHover: '#0056b3',
  errorColor: 'red'
};

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.formBackground};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 100;
  margin-bottom: 2rem;
`;


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-top: 5rem;
`;


const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  background-color: ${({ theme }) => theme.formBackground};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 95%; /* Ensures all fields take full width */
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  width: 103%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  width: 20%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.errorColor};
  font-size: 0.875rem;
`;

const ResultBox = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.boxBackground};
  border-radius: 8px;
`;

const ResultLabel = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ResultValue = styled.div`
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 0.5rem;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-left: 1rem;
`;

const ThemeSwitcher = ({ toggleTheme }) => (
  <Button onClick={toggleTheme}>Toggle Theme</Button>
);

const EMIForm = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    tenure: '',
    tenureType: 'months',
    prepayment: ''
  });

  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [theme, setTheme] = useState(lightTheme);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errorList = {};
    if (!formData.loanAmount || formData.loanAmount <= 0) {
      errorList.loanAmount = "Loan amount is required and must be a positive number.";
    }
    if (!formData.interestRate || formData.interestRate <= 0) {
      errorList.interestRate = "Interest rate is required and must be a positive number.";
    }
    if (!formData.tenure || formData.tenure <= 0) {
      errorList.tenure = "Loan tenure is required and must be a positive number.";
    }

    setErrors(errorList);
    return Object.keys(errorList).length === 0;
  };

  const calculateEMI = (loanAmount, interestRate, tenure) => {
    const monthlyInterestRate = interestRate / 12 / 100;
    return (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -tenure));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const loanAmount = parseFloat(formData.loanAmount);
      const interestRate = parseFloat(formData.interestRate);
      const adjustedTenure = formData.tenureType === 'years' ? formData.tenure * 12 : parseInt(formData.tenure, 10);
      const prepayment = formData.prepayment ? parseFloat(formData.prepayment) : 0;

      const emi = calculateEMI(loanAmount, interestRate, adjustedTenure);
      const totalInterest = (emi * adjustedTenure) - loanAmount;
      const totalAmountPayable = loanAmount + totalInterest;

      let remainingBalance = loanAmount;
      const breakdown = [];

      for (let month = 1; month <= adjustedTenure; month++) {
        const interestPaid = remainingBalance * (interestRate / 12 / 100);
        const principalPaid = emi - interestPaid;
        remainingBalance -= principalPaid;

        if (month % 1 === 0) {
          remainingBalance -= prepayment;
          if (remainingBalance < 0) remainingBalance = 0;
        }

        breakdown.push({
          month,
          emi: emi.toFixed(2),
          interestPaid: interestPaid.toFixed(2),
          principalPaid: principalPaid.toFixed(2),
          remainingBalance: remainingBalance.toFixed(2)
        });

        if (remainingBalance <= 0) break;
      }

      const newTotalInterest = breakdown.reduce((sum, entry) => sum + parseFloat(entry.interestPaid), 0);
      const newTotalAmountPayable = loanAmount + newTotalInterest;

      setResults({
        emi: emi.toFixed(2),
        totalInterest: newTotalInterest.toFixed(2),
        totalAmountPayable: newTotalAmountPayable.toFixed(2),
        prepayment,
        breakdown
      });
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  const downloadTableAsPDF = () => {
    const printContent = document.getElementById('emi-results').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Navbar>
        <Title>EMI Calculator</Title>
        <ThemeSwitcher toggleTheme={toggleTheme} />
      </Navbar>
      <PageContainer>
        <FormContainer>
          <form onSubmit={handleSubmit}>
       
            <InputField>
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <Input
                type="number"
                id="loanAmount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
              />
              {errors.loanAmount && <ErrorMessage>{errors.loanAmount}</ErrorMessage>}
            </InputField>

          
            <InputField>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                type="number"
                id="interestRate"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
              />
              {errors.interestRate && <ErrorMessage>{errors.interestRate}</ErrorMessage>}
            </InputField>

            <InputField>
              <Label htmlFor="tenure">Loan Tenure</Label>
              <Input
                type="number"
                id="tenure"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
              />
              <Select
                id="tenureType"
                name="tenureType"
                value={formData.tenureType}
                onChange={handleChange}
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </Select>
              {errors.tenure && <ErrorMessage>{errors.tenure}</ErrorMessage>}
            </InputField>

        
            <InputField>
              <Label htmlFor="prepayment">Prepayment (optional)</Label>
              <Input
                type="number"
                id="prepayment"
                name="prepayment"
                value={formData.prepayment}
                onChange={handleChange}
              />
            </InputField>

            <Button type="submit">Calculate EMI</Button>
          </form>

          {results && (
            <ResultBox>
              <div id="emi-results">
                <ResultLabel>EMI: </ResultLabel>
                <ResultValue>{results.emi}</ResultValue>

                <ResultLabel>Total Interest Payable: </ResultLabel>
                <ResultValue>{results.totalInterest}</ResultValue>

                <ResultLabel>Total Amount Payable: </ResultLabel>
                <ResultValue>{results.totalAmountPayable}</ResultValue>

                <ResultLabel>Prepayment (Monthly): </ResultLabel>
                <ResultValue>{results.prepayment}</ResultValue>

                <Table>
                  <thead>
                    <tr>
                      <TableHeader>Month</TableHeader>
                      <TableHeader>EMI</TableHeader>
                      <TableHeader>Interest Paid</TableHeader>
                      <TableHeader>Principal Paid</TableHeader>
                      <TableHeader>Remaining Balance</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {results.breakdown.map((entry) => (
                      <tr key={entry.month}>
                        <TableCell>{entry.month}</TableCell>
                        <TableCell>{entry.emi}</TableCell>
                        <TableCell>{entry.interestPaid}</TableCell>
                        <TableCell>{entry.principalPaid}</TableCell>
                        <TableCell>{entry.remainingBalance}</TableCell>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Add space between table and button */}
              <div style={{ marginTop: '20px' }}>
                <Button onClick={downloadTableAsPDF}>Download PDF</Button>
              </div>
            </ResultBox>
          )}
        </FormContainer>
      </PageContainer>
    </ThemeProvider>
  );
};

export default EMIForm;
