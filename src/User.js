import React from "react";
import { Box, Heading, Form, FormField, TextInput, Button, MaskedInput } from "grommet";
import validator from "validator";
import { Link, Redirect } from "react-router-dom";
import ImageUploader from "react-images-upload";

export default class User extends React.Component {
    constructor() {
        super();

        this.state = {
            name: window.sessionStorage.getItem("username"),
            nameError: null,
            birth: window.sessionStorage.getItem("birth"),
            birthError: null,
            image: window.sessionStorage.getItem("image"),
            redirect: false,
        };

        this.submitHandle = this.submitHandle.bind(this);
        this.changeHandle = this.changeHandle.bind(this);
        this.imageChangeHandle = this.imageChangeHandle.bind(this);
    }

    imageChangeHandle(image) {
        this.setState({
            image: image,
        });
    }

    submitHandle() {
        const { name, birth, image } = this.state;

        if (!validator.isEmpty(birth)) {
            if (
                !birth.match(
                    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
                )
            ) {
                this.setState({
                    birthError: "Debes introducir una fecha válida",
                });
                return;
            }
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
        if (window.sessionStorage.length === 0) {
            document.location = "/";
        }

        if (this.state.redirect) {
            return <Redirect to="/app" />;
        }

        return (
            <Box fill="vertical" overflow="auto" align="center" flex="grow" direction="column" justify="between" gap="large" pad="medium">
                <Box align="stretch" justify="center" round="medium" elevation="medium" gap="small" pad="medium" width="large">
                    <Box align="start" fill="horizontal">
                        <Link className="link" to="/app">
                            {"< Volver"}
                        </Link>
                        <Heading>Perfil de Usuario</Heading>
                    </Box>
                    <Form onChange={this.changeHandle} onSubmit={this.submitHandle}>
                        <FormField error={this.state.nameError} label="Nombre">
                            <TextInput value={this.state.name} name="name" />
                        </FormField>

                        <FormField error={this.state.birthError} label="Fecha de Nacimiento">
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
                                value={this.state.birth}
                                name="birth"
                            />
                        </FormField>
                        <FormField label="Imagen de perfil">
                            <ImageUploader singleImage={true} onChange={this.imageChangeHandle} />
                        </FormField>
                        <Box align="center" justify="center" fill="horizontal">
                            <Button label="Actualizar" type="submit" secondary={false} primary={true} />
                        </Box>
                    </Form>
                </Box>
            </Box>
        );
    }
}
