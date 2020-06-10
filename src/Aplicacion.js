import React from "react";
import { Box, Heading, Text, Button, Tabs, Tab, Select, Form, FormField, TextInput, Layer, MaskedInput } from "grommet";
import validator from "validator";
import { AddCircle, Calendar, FormEdit, FormTrash } from "grommet-icons";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Link } from "react-router-dom";

class EditModal extends React.Component {

    constructor() {
        super();

        this.state = {
            date: '',
            dateError: null,
            type: '',
            typeError: null,
            category: '',
            categoryError: null,
            currency: '',
            currencyError: null,
            amount: '',
            amountError: null,
            currencies: window.sessionStorage.getItem('currencies').split(','),
            categories: window.sessionStorage.getItem('categories').split(',')
        }

        this.submitHandle = this.submitHandle.bind(this);
        this.changeHandle = this.changeHandle.bind(this);

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
    }

    componentDidMount() {
        const balance = this.props.balance;
        this.setState({
            date: balance.date,
            type: balance.type,
            category: balance.category,
            currency: balance.currency,
            amount: balance.amount
        });
    }

    changeHandle(ev) {
        const prop = ev.target.getAttribute("name");
        this.setState({
            [prop]: ev.target.value,
        });
    }

    submitHandle() {
        const {date, type, category, currency, amount} = this.state;

        if (
            !date.match(
                /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
            )
        ) {
            this.setState({
                dateError: "Debes introducir una fecha válida",
            });
            return;
        }

        if(validator.isEmpty(type)) {
            this.setState({
                typeError: 'Debes introducir un tipo válido'
            });
            return;
        }

        if(validator.isEmpty(category)) {
            this.setState({
                categoryError: 'Debes seleccionar una categoría válida'
            });
            return;
        }

        if(validator.isEmpty(currency)) {
            this.setState({
                currencyError: 'Debes seleccionar una moneda válida'
            });
            return;
        }

        if(!validator.isNumeric(amount + '')) {
            this.setState({
                amountError: 'Debes introducir un monto válido'
            });
            return;
        }


        this.props.hideModal();
        const newBalance = {
            date: date,
            type: type,
            category: category,
            currency: currency,
            amount: amount
        };

        this.props.editBalanceHandler(newBalance);
    }

    handleCategoryChange(obj) {
        this.setState({
            category: obj.value,
        });
    }

    handleCurrencyChange(obj) {
        this.setState({
            currency: obj.value,
        });
    }

    handleTypeChange(obj) {
        this.setState({
            type: obj.value,
        });
    }

    render() {
        return (
            <Box pad="medium" round="medium" fill="vertical" overflow="auto" align="center" flex="grow">
                <Form onChange={this.changeHandle} onSubmit={this.submitHandle}>
                    <FormField error={this.state.dateError} label="Fecha">
                        <MaskedInput
                            mask={[
                                {
                                    length: [2],
                                    options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
                                    placeholder: "dd",
                                },
                                { fixed: "/" },
                                {
                                    length: [2],
                                    options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
                                    placeholder: "mm",
                                },
                                { fixed: "/" },
                                {
                                    length: [1, 4],
                                    placeholder: "yyyy",
                                },
                            ]}
                            value={this.state.date}
                            name="date"
                        />
                    </FormField>
                    <FormField error={this.state.typeError} label="Tipo">
                        <Select onChange={this.handleTypeChange} value={this.state.type} name="type" options={['ingreso', 'egreso']} />
                    </FormField>
                    <FormField error={this.state.categoryError} label="Categoría">
                        <Select onChange={this.handleCategoryChange} value={this.state.category} name="category" options={this.state.categories} />
                    </FormField>
                    <FormField error={this.state.currencyError} label="Moneda">
                        <Select onChange={this.handleCurrencyChange} value={this.state.currency} name="currency" options={this.state.currencies} />
                    </FormField>
                    <FormField error={this.state.amountError} label="Monto">
                      <TextInput value={this.state.amount} name="amount" />
                    </FormField>
                    <Box align="stretch" justify="center">
                      <Button label="Editar" primary={true} type="submit" />
                    </Box>
                  </Form>
            </Box>
        );
    }

}

class TableBalances extends React.Component {
    constructor() {
        super();

        this.deleteClickHandle = this.deleteClickHandle.bind(this);
        this.editClickHandle = this.editClickHandle.bind(this);
    }

    editClickHandle(ev) {
        const key = ev.target.getAttribute("data-key");
        if (!key) {
            return;
        }

        this.props.editHandler(key);
    }

    deleteClickHandle(ev) {
        const key = ev.target.getAttribute("data-key");
        if (!key) {
            return;
        }

        this.props.deleteHandler(key);
    }

    render() {
        return (
            <Box align="center" justify="center" margin={{ top: "medium" }}>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Fecha</Th>
                            <Th>Tipo</Th>
                            <Th>Categoría</Th>
                            <Th>Moneda</Th>
                            <Th>Monto</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {this.props.balances.map((entry, i) => {
                            return (
                                <Tr key={i}>
                                    <Td>{entry.date}</Td>
                                    <Td>{entry.type}</Td>
                                    <Td>{entry.category}</Td>
                                    <Td>{entry.currency}</Td>
                                    <Td>{entry.amount}</Td>
                                    <Td>
                                        <Button onClick={this.deleteClickHandle} data-key={i} icon={<FormTrash data-key={i} />} type="button"/>
                                    </Td>
                                    <Td>
                                        <Button onClick={this.editClickHandle} data-key={i} icon={<FormEdit data-key={i} />} type="button" />
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>
        );
    }
}

class TableExpensesPerMonth extends React.Component {
    constructor() {
        super();

        this.state = {
            month: "",
            data: [],
        };

        this.changeMonthHandle = this.changeMonthHandle.bind(this);
    }

    async componentDidMount() {
        const today = new Date();
        const data = await this.props.getExpensesPerMonthHandler(today.getMonth());

        this.setState({
            data: data,
        });
    }

    async changeMonthHandle(obj) {
        const month = obj.value;
        this.setState({
            month: month,
        });

        const data = await this.props.getExpensesPerMonthHandler(month);

        this.setState({
            data: data,
        });
    }

    render() {
        return (
            <Box align="center" justify="center" direction="row-responsive" gap="medium" margin={{ top: "medium" }}>
                <Box align="center" justify="center" fill="horizontal">
                    <Select
                        value={this.state.month}
                        onChange={this.changeMonthHandle}
                        options={["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]}
                        placeholder="Seleccione un mes"
                        size="large"
                        closeOnChange={true}
                        icon={<Calendar />}
                    />
                </Box>
                <Box align="center" justify="center" fill="horizontal">
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Fecha</Th>
                                <Th>Categoría</Th>
                                <Th>Moneda</Th>
                                <Th>Monto</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {this.state.data.map((entry, i) => {
                                return (
                                    <Tr key={i}>
                                        <Td>{entry.date}</Td>
                                        <Td>{entry.category}</Td>
                                        <Td>{entry.currency}</Td>
                                        <Td>{entry.amount}</Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        );
    }
}

class TableExpensesPerCategory extends React.Component {
    constructor() {
        super();

        this.state = {
            month: "",
            data: [],
        };

        this.changeMonthHandle = this.changeMonthHandle.bind(this);
    }

    async componentDidMount() {
        const today = new Date();
        const data = await this.props.getExpensesPerCategoryHandler(today.getMonth());

        this.setState({
            data: data,
        });
    }

    async changeMonthHandle(obj) {
        const month = obj.value;
        this.setState({
            month: month,
        });

        const data = await this.props.getExpensesPerCategoryHandler(month);

        this.setState({
            data: data,
        });
    }

    render() {
        return (
            <Box align="center" justify="center" margin={{ top: "medium" }} direction="row-responsive" gap="small">
                <Box align="center" justify="center" fill="horizontal">
                    <Select
                        onChange={this.changeMonthHandle}
                        value={this.state.month}
                        options={["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]}
                        placeholder="Seleccione un mes"
                        size="large"
                        closeOnChange={true}
                        icon={<Calendar />}
                    />
                </Box>
                <Box align="center" justify="center" fill="horizontal">
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Fecha</Th>
                                <Th>Categoría</Th>
                                <Th>Monto</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {this.state.data.map((entry, i) => {
                                return (
                                    <Tr key={i}>
                                        <Td>{entry.date}</Td>
                                        <Td>{entry.category}</Td>
                                        <Td>{entry.amount}</Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        );
    }
}

const TableExpensesProyection = (props) => (
    <Box margin={{ top: "medium" }}>
        <Table>
            <Thead>
                <Tr>
                    <Th>Mes</Th>
                    {window.sessionStorage
                        .getItem("currencies")
                        .split(",")
                        .map((currency, i) => (
                            <Th key={i}>{currency}</Th>
                        ))}
                </Tr>
            </Thead>
            <Tbody>
                {props.balances.map((balance, i) => (
                    <Tr key={i}>
                        <Td>{balance.month}</Td>
                        {balance.balances.map((expenses, i) => (
                            <Td key={i}>{expenses.amount}</Td>
                        ))}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </Box>
);

export default class Aplicacion extends React.Component {
    constructor() {
        super();

        this.state = {
            showNewEntryModal: false,
            balances: [],
            expensesPerMonth: [],
            expensesPerCategory: [],
            expensesProyection: [],
            expensesProyectionColumns: [],
            currencies: window.sessionStorage.getItem("currencies").split(","),
            balancesByCurrencies: [],
            showEditModal: false,
            selectedBalance: null,
            selectedKey: 0
        };

        this.logoutHandler = this.logoutHandler.bind(this);

        this.deleteBalance = this.deleteBalance.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.hideEditModal = this.hideEditModal.bind(this);

        this.editBalance = this.editBalance.bind(this);
    }

    async componentDidMount() {
        const balances = await this.props.getAllBalancesHandler();

        const today = new Date();
        const expensesPerMonth = await this.props.getExpensesPerMonthHandler(today.getMonth());
        const expensesPerCategory = await this.props.getExpensesPerCategoryHandler(today.getMonth());
        const expensesProyection = await this.props.getExpensesProyectionHandler();

        const balancesByCurrencies = await this.props.getBalancesByCurrenciesHandler();

        const expensesProyectionColumns = window.sessionStorage.getItem("currencies").split(",");

        this.setState({
            balances: balances,
            expensesPerMonth: expensesPerMonth,
            expensesPerCategory: expensesPerCategory,
            expensesProyection: expensesProyection,
            expensesProyectionColumns: expensesProyectionColumns,
            balancesByCurrencies: balancesByCurrencies,
        });
    }

    logoutHandler() {
        window.sessionStorage.clear();
        window.location = "/";
    }

    deleteFromArray(array, key) {
        const balances = array;
        balances.splice(key, 1);

        return balances;
    }

    deleteBalance(key) {
        const newBalances = this.deleteFromArray(this.state.balances, key);

        this.setState({
            balances: newBalances
        });

    }

    showEditModal(key) {
        this.setState({
            showEditModal: true,
            selectedBalance: this.state.balances[key],
            selectedKey: key
        });
    }

    editBalance(newBalance) {
        const balances = this.state.balances;
        balances[this.state.selectedKey] = newBalance;

        this.setState({
            balances: balances
        });

    }

    hideEditModal() {
        this.setState({
            showEditModal: false
        });
    }

    render() {
        if (window.sessionStorage.length === 0) {
            document.location = "/";
        }
        return (
            <Box align="center" justify="center" pad="large" gap="medium">
            {
                this.state.showEditModal && (
                    <Layer onClickOutside={this.hideEditModal} onEsc={this.hideEditModal}>
                        <EditModal editBalanceHandler={this.editBalance} balance={this.state.selectedBalance} hideModal={this.hideEditModal} />
                    </Layer>
                )
            }

                <Box background="brand" align="center" justify="center" direction="row-responsive" fill="horizontal" elevation="medium" round="medium" pad="medium">
                    <Box align="center" justify="center" gap="large" fill="horizontal">
                        <Heading margin="small">Balance Actual</Heading>

                        <Table>
                            <Thead>
                                <Tr>
                                    {this.state.balancesByCurrencies.map((balance, i) => (
                                        <Th>{balance.currency}</Th>
                                    ))}
                                </Tr>
                            </Thead>

                            <Tbody>
                                <Tr>
                                    {this.state.balancesByCurrencies.map((balance, i) => (
                                        <Td>{balance.amount}</Td>
                                    ))}
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>
                    <Box align="center" justify="center" gap="small" fill="horizontal" pad="large">
                        <Box align="center" justify="center" direction="row-responsive" gap="small">
                            <Text weight="bold" size="medium">
                                <Link style={{ color: "white" }} to="/user">
                                    {window.sessionStorage.getItem("username")}
                                </Link>
                            </Text>
                        </Box>

                        <Link to="/nuevo">
                            <Button label="Añadir registro" fill="horizontal" size="large" icon={<AddCircle />} />
                        </Link>
                    </Box>
                </Box>

                <Box align="stretch" justify="start" fill="horizontal" elevation="medium" round="medium" pad="medium">
                    <Heading level="2">Reportes</Heading>
                    <Tabs justify="center">
                        <Tab title="Balances">
                            <TableBalances balances={this.state.balances} editHandler={this.showEditModal} deleteHandler={this.deleteBalance} />
                        </Tab>

                        <Tab title="Gastos por mes">
                            <TableExpensesPerMonth getExpensesPerMonthHandler={this.props.getExpensesPerMonthHandler} />
                        </Tab>

                        <Tab title="Gastos por categoría" reverse={false}>
                            <TableExpensesPerCategory getExpensesPerCategoryHandler={this.props.getExpensesPerCategoryHandler} />
                        </Tab>

                        <Tab title="Proyección de gastos">
                            <TableExpensesProyection balances={this.state.expensesProyection} />
                        </Tab>
                    </Tabs>
                </Box>

                <Box fill={true} align="end" justify="center" margin={{ top: "medium" }}>
                    <Button onClick={this.logoutHandler} color="status-error" size="small" label="Salir" primary={true} type="button" plain={false} />
                </Box>
            </Box>
        );
    }
}
