import React from "react";
import { Grommet, Header, Anchor } from "grommet";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import theme from "./theme";

import Login from "./Login";
import Registro from "./Registro";
import Aplicacion from "./Aplicacion";
import NuevoRegistro from "./NuevoRegistro";
import User from "./User";

export default class App extends React.Component {
    render() {
        return (
            <Grommet theme={theme}>
                <Router>
                    <Header pad="medium" border={{ color: "brand", size: "small", side: "bottom" }}>
                        <Link to="/">
                            <Anchor href="#" label="Finanzas Personales" />
                        </Link>
                    </Header>

                    <Switch>
                        <Route path="/registro">
                            <Registro registerHandler={this.props.appHandler.registerHandler} />
                        </Route>

                        <Route path="/app">
                            <Aplicacion
                                getAllBalancesHandler={this.props.appHandler.getAllBalances}
                                getExpensesPerMonthHandler={this.props.appHandler.getExpensesPerMonth}
                                getExpensesPerCategoryHandler={this.props.appHandler.getExpensesPerCategory}
                                getExpensesProyectionHandler={this.props.appHandler.getExpensesProyection}
                                getBalancesByCurrenciesHandler={this.props.appHandler.getBalancesByCurrencies}
                            />
                        </Route>

                        <Route path="/nuevo">
                            <NuevoRegistro />
                        </Route>

                        <Route path="/user">
                            <User />
                        </Route>

                        <Route path="">
                            <Login loginHandler={this.props.appHandler.loginHandler} />
                        </Route>
                    </Switch>
                </Router>
            </Grommet>
        );
    }
}
