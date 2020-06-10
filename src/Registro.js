import React from "react";
import validator from "validator";
import { Box, Form, FormField, TextInput, Button, Heading } from "grommet";
import { MailOption, Lock } from "grommet-icons";
import { Redirect, Link } from "react-router-dom";

export default class Registro extends React.Component {
    constructor() {
        super();

        this.state = {
            email: "",
            emailError: null,
            password: "",
            passwordError: null,
            passwordConfirm: "",
            passwordConfirmError: null,
            redirect: false,
        };

        this.submitHandle = this.submitHandle.bind(this);
        this.changeHandle = this.changeHandle.bind(this);
        this.cleanErrors = this.cleanErrors.bind(this);
    }

    cleanErrors() {
        this.setState({
            emailError: null,
            passwordError: null,
            passwordConfirmError: null,
        });
    }

    async submitHandle() {
        this.cleanErrors();
        const email = this.state.email;
        const password = this.state.password;
        const passwordConfirm = this.state.passwordConfirm;

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

        if (!validator.equals(passwordConfirm, password)) {
            this.setState({
                passwordConfirmError: "Las contraseñas no coinciden",
            });
            return;
        }

        this.cleanErrors();

        try {
            const user = await this.props.registerHandler(email, password);

            window.sessionStorage.setItem("role", user.role);
            window.sessionStorage.setItem("username", user.profile.name);
            window.sessionStorage.setItem("birth", user.profile.birth);
            window.sessionStorage.setItem("image", user.profile.image);
            window.sessionStorage.setItem("currencies", user.profile.currencies);
        } catch (err) {
            this.setState({
                passwordConfirmError: err.message,
            });
            return;
        }

        this.setState({
            redirect: true,
        });
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
            <Box align="center" justify="center" pad="xlarge">
                <Heading>Registro</Heading>
                <Box width="medium" align="stretch" justify="start" direction="column" elevation="large" round="medium" pad="medium">
                    <Link className="link" to="/">
                        {"< Volver"}
                    </Link>
                    <br />
                    <Form onChange={this.changeHandle} onSubmit={this.submitHandle}>
                        <FormField error={this.state.emailError} label="Correo">
                            <TextInput name="email" type="text" icon={<MailOption />} />
                        </FormField>

                        <FormField error={this.state.passwordError} label="Contraseña">
                            <TextInput name="password" type="password" icon={<Lock />} />
                        </FormField>

                        <FormField error={this.state.passwordConfirmError} label="Confirma la contraseña">
                            <TextInput name="passwordConfirm" type="password" icon={<Lock />} />
                        </FormField>

                        <Box align="stretch" justify="center" gap="xsmall" margin={{ top: "medium" }}>
                            <Button label="Registrarse" type="submit" primary={true} />
                        </Box>
                    </Form>
                </Box>
            </Box>
        );
    }
}
