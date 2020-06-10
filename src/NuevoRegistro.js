import React from "react";
import { Box, Form, FormField, TextInput, TextArea, Button, Select, Heading, MaskedInput, Layer } from "grommet";
import validator from "validator";
import { AddCircle } from "grommet-icons";
import { Link, Redirect } from "react-router-dom";

class NewCategoryModal extends React.Component {
    constructor() {
        super();
        this.state = {
            category: "",
            categoryError: null,
        };

        this.submitHandle = this.submitHandle.bind(this);
        this.changeHandle = this.changeHandle.bind(this);
    }

    changeHandle(ev) {
        const prop = ev.target.getAttribute("name");
        this.setState({
            [prop]: ev.target.value,
        });
    }

    submitHandle() {
        const category = this.state.category;

        if (validator.isEmpty(category)) {
            this.setState({
                categoryError: "Debes introducir una categoría",
            });
            return;
        }

        this.props.addNewCategoryHandler(category);
    }

    render() {
        return (
            <Box align="center" justify="start" pad="medium">
                <Form onChange={this.changeHandle} onSubmit={this.submitHandle}>
                    <FormField error={this.state.categoryError} label="Categoria">
                        <TextInput name="category" />
                    </FormField>
                    <Box align="start" justify="center">
                        <Button label="Agregar" type="submit" />
                    </Box>
                </Form>
            </Box>
        );
    }
}

class NewCurrencyModal extends React.Component {
    constructor() {
        super();
        this.state = {
            currency: "",
            currencyError: null,
        };

        this.submitHandle = this.submitHandle.bind(this);
        this.changeHandle = this.changeHandle.bind(this);
    }

    changeHandle(ev) {
        const prop = ev.target.getAttribute("name");
        this.setState({
            [prop]: ev.target.value,
        });
    }

    submitHandle() {
        const currency = this.state.currency;

        if (validator.isEmpty(currency)) {
            this.setState({
                currencyError: "Debes introducir una moneda",
            });
            return;
        }

        this.props.addNewCurrencyHandler(currency);
    }

    render() {
        return (
            <Box align="center" justify="start" pad="medium">
                <Form onChange={this.changeHandle} onSubmit={this.submitHandle}>
                    <FormField error={this.state.currencyError} label="Moneda">
                        <TextInput name="currency" />
                    </FormField>
                    <Box align="start" justify="center">
                        <Button label="Agregar" type="submit" />
                    </Box>
                </Form>
            </Box>
        );
    }
}

export default class NuevoRegistro extends React.Component {
    constructor() {
        super();

        this.state = {
            title: "",
            titleError: null,
            desc: "",
            descError: null,
            type: "",
            typeError: null,
            category: "",
            categoryError: null,
            currency: "",
            currencyError: null,
            amount: "",
            amountError: null,
            date: "",
            dateError: null,
            categories: window.sessionStorage.getItem("categories").split(","),
            currencies: window.sessionStorage.getItem("currencies").split(","),
            redirect: false,
            showNewCategoryModal: false,
            showNewCurrencyModal: false,
        };

        this.submitHandle = this.submitHandle.bind(this);
        this.changeHandle = this.changeHandle.bind(this);

        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);

        this.cleanErrors = this.cleanErrors.bind(this);

        this.handleNewCategoryClick = this.handleNewCategoryClick.bind(this);
        this.handleNewCurrencyClick = this.handleNewCurrencyClick.bind(this);

        this.hideNewCategoryModal = this.hideNewCategoryModal.bind(this);
        this.hideNewCurrencyModal = this.hideNewCurrencyModal.bind(this);

        this.addNewCategoryHandler = this.addNewCategoryHandler.bind(this);
        this.addNewCurrencyHandler = this.addNewCurrencyHandler.bind(this);

        this.handleTypeChange = this.handleTypeChange.bind(this);
    }

    handleTypeChange(obj) {
        this.setState({
            type: obj.value
        })
    }

    handleCategoryChange(obj) {
        this.setState({
            category: obj.value
        });
    }

    handleCurrencyChange(obj) {
        this.setState({
            currency: obj.value
        });
    }

    changeHandle(ev) {
        const prop = ev.target.getAttribute("name");
        this.setState({
            [prop]: ev.target.value
        });
    }

    cleanErrors() {
        this.setState({
            titleError: null,
            descError: null,
            categoryError: null,
            currencyError: null,
            amountError: null,
            dateError: null,
        });
    }

    submitHandle() {
        this.cleanErrors();
        const { title, desc, category, currency, amount, date } = this.state;

        if (validator.isEmpty(title)) {
            this.setState({
                titleError: "Debes introducir un título",
            });
            return;
        }

        if (validator.isEmpty(title)) {
            this.setState({
                typeError: "Debes seleccionar un tipo",
            });
            return;
        }

        if (validator.isEmpty(category)) {
            this.setState({
                categoryError: "Debes seleccionar una categoría",
            });
            return;
        }

        if (validator.isEmpty(currency)) {
            this.setState({
                currencyError: "Debes seleccionar una moneda",
            });
            return;
        }

        if (!validator.isNumeric(amount)) {
            this.setState({
                amountError: "Debes introducir un monto válido",
            });
            return;
        }

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

        this.setState({
            redirect: true,
        });
    }

    handleNewCategoryClick() {
        this.setState({
            showNewCategoryModal: true,
        });
    }

    handleNewCurrencyClick() {
        this.setState({
            showNewCurrencyModal: true,
        });
    }

    addNewCategoryHandler(category) {
        this.setState({
            categories: this.state.categories.concat(category),
        });

        this.hideNewCategoryModal();
    }

    addNewCurrencyHandler(currency) {
        this.setState({
            currencies: this.state.currencies.concat(currency),
        });

        this.hideNewCurrencyModal();
    }

    hideNewCategoryModal() {
        this.setState({
            showNewCategoryModal: false,
        });
    }

    hideNewCurrencyModal() {
        this.setState({
            showNewCurrencyModal: false,
        });
    }

    render() {
        if (window.sessionStorage.length === 0) {
            document.location = "/";
        }

        if (this.state.redirect) {
            return <Redirect to="/app" />;
        }

        return (
            <Box fill="vertical" overflow="auto" align="center" pad="medium">
                <Box width="large" align="stretch" justify="center" pad="medium" round="medium" elevation="medium" flex="grow">
                    <Link className="link" to="/app">
                        {"< Volver"}
                    </Link>
                    <Heading>Nuevo Registro</Heading>
                    {this.state.showNewCategoryModal && (
                        <Layer onClickOutside={this.hideNewCategoryModal} onEsc={this.hideNewCategoryModal}>
                            <NewCategoryModal addNewCategoryHandler={this.addNewCategoryHandler} />
                        </Layer>
                    )}
                    {this.state.showNewCurrencyModal && (
                        <Layer onClickOutside={this.hideNewCurrencyModal} onEsc={this.hideNewCurrencyModal}>
                            <NewCurrencyModal addNewCurrencyHandler={this.addNewCurrencyHandler} />
                        </Layer>
                    )}

                    <Form onChange={this.changeHandle} onSubmit={this.submitHandle}>
                        <FormField error={this.state.titleError} label="Título">
                            <TextInput name="title" />
                        </FormField>
                        <FormField error={this.state.descError} label="Descripción">
                            <TextArea name="desc" />
                        </FormField>
                        <FormField error={this.state.typeError} label="Tipo">
                            <Select onChange={this.handleTypeChange} value={this.state.type} name="type" options={['ingreso', 'egreso']} />
                        </FormField>
                        <FormField error={this.state.categoryError} label="Categoría">
                            <Box align="stretch" justify="between" direction="row-responsive" pad="small">
                                <Button onClick={this.handleNewCategoryClick} icon={<AddCircle />} />
                                <Select onChange={this.handleCategoryChange} value={this.state.category} name="category" options={this.state.categories} />
                            </Box>
                        </FormField>
                        <FormField error={this.state.currencyError} label="Moneda">
                            <Box align="stretch" justify="between" direction="row-responsive" pad="small">
                                <Button onClick={this.handleNewCurrencyClick} icon={<AddCircle />} />
                                <Select onChange={this.handleCurrencyChange} value={this.state.currency} name="currency" options={this.state.currencies} />
                            </Box>
                        </FormField>
                        <FormField error={this.state.amountError} label="Monto">
                            <TextInput name="amount" />
                        </FormField>
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
                        <Box align="center" justify="center" margin="small">
                            <Button type="submit" primary={true} label="Crear nuevo registro" />
                        </Box>
                    </Form>
                </Box>
            </Box>
        );
    }
}
