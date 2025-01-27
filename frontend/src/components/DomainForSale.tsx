import React, { useState } from "react";
import {
    Box,
    Button,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { baseUrl } from "../helpers/environment_detection.ts";

const DomainForSale: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        price: "",
    });
    const [isEmailValid, setIsEmailValid] = useState(false); // State to track email validity

    const domainName = window.location.hostname; // Dynamically pull the domain name

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        // Update form data
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Validate email if the input field is for email
        if (name === "email") {
            setIsEmailValid(validateEmail(value));
        }
    };

    const validateEmail = (email: string) => {
        // Corrected email regex for validation
        const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const combinedMessage = `${
                formData.message ? `${formData.message}\n` : ""
            }Offer: $${formData.price}`;

            const response = await fetch(`${baseUrl}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    domain: domainName,
                    name: formData.name,
                    email: formData.email,
                    message: combinedMessage,
                }),
            });

            if (response.ok) {
                alert("Message sent successfully!");
                setFormData({ name: "", email: "", message: "", price: "" });
                setIsEmailValid(false); // Reset email validity
                setOpen(false);
            } else {
                alert("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    textAlign: "center",
                    backgroundColor: theme.palette.background.default,
                    padding: 2,
                }}
            >
                <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>
                    {domainName} is For Sale!
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Interested in purchasing this domain? Send us an offer!
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                >
                    Make an Offer
                </Button>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Make an Offer</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            label="Name or Business"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={!isEmailValid && formData.email.length > 0}
                            helperText={
                                !isEmailValid && formData.email.length > 0
                                    ? "Please enter a valid email address"
                                    : ""
                            }
                        />
                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            label="Price Offer (USD)"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            label="Additional Message (Optional)"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={!isEmailValid} // Disable button until email is valid
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DomainForSale;