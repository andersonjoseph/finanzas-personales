import React from "react";
import validator from "validator";
import { Box, Heading, Form, FormField, TextInput, Button } from "grommet";
import { MailOption, Lock } from "grommet-icons";
import { Redirect, Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            email: "",
            emailError: null,
            password: "",
            passwordError: null,
            redirect: false,
        };

        this.submitHandle = this.submitHandle.bind(this);
        this.changeHandle = this.changeHandle.bind(this);
        this.cleanErrors = this.cleanErrors.bind(this);
        window.sessionStorage.clear();
    }

    cleanErrors() {
        this.setState({
            emailError: null,
            passwordError: null,
        });
    }

    async submitHandle() {
        this.cleanErrors();

        const email = this.state.email;
        const password = this.state.password;

        if (!validator.isEmail(email)) {
            this.setState({
                emailError: "Debes introducir un email válido",
            });
            return;
        }

        if (validator.isEmpty(password)) {
            this.setState({
                passwordError: "Debes introducir una contraseña válida",
            });
            return;
        }

        this.cleanErrors();

        try {
            const user = await this.props.loginHandler(email, password);

            window.sessionStorage.setItem("role", user.role);
            window.sessionStorage.setItem("email", user.email);
            window.sessionStorage.setItem("username", user.profile.name);
            window.sessionStorage.setItem("birth", user.profile.birth);
            window.sessionStorage.setItem("image", user.profile.image);
            window.sessionStorage.setItem("currencies", user.profile.currencies);
            window.sessionStorage.setItem("categories", user.profile.categories);

            this.setState({
                redirect: true,
            });
        } catch (err) {
            this.setState({
                passwordError: err.message,
            });
            return;
        }
    }

    changeHandle(ev) {
        const prop = ev.target.getAttribute("name");
        this.setState({
            [prop]: ev.target.value,
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/app" />;
        }
        return (
            <Box align="center" justify="center" pad="medium">
                <Heading>Login</Heading>

                <Box width="medium" align="stretch" justify="start" direction="column" elevation="large" round="medium" pad="medium">
                    <Form onChange={this.changeHandle} onSubmit={this.submitHandle}>
                        <FormField error={this.state.emailError} label="Correo">
                            <TextInput name="email" type="text" icon={<MailOption />} />
                        </FormField>

                        <FormField error={this.state.passwordError} label="Contraseña">
                            <TextInput name="password" type="password" icon={<Lock />} />
                        </FormField>

                        <Box align="stretch" justify="center" gap="xsmall" margin={{ top: "medium" }}>
                            <Button label="Ingresar" type="submit" primary={true} />
                        </Box>
                    </Form>
                </Box>

                <br />
                <Link className="link" to="/registro">
                    ¿No tienes una cuenta? Regístrate ahora
                </Link>
            </Box>
        );
    }
}
