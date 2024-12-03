import React from "react";
import { Card, Typography, Divider, Box, Chip, Avatar } from "@mui/material";
import { BorderLinearProgress } from "./BorderLinearProgress";
import { ComapnayPolicies } from "./dashboradInfo";
import { useSelector } from "react-redux";

const ComapnayPolicie = ({ dateStatus }) => {
    const { overviewData } = useSelector((state) => state.overview);
    return (
        <>
            <Card
                sx={{
                    padding: "1rem",
                    width: "full",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <Box sx={{display : "flex" , justifyContent : "space-between"}}>
                    <Typography variant="h6">Insurance company policies</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            alignItems: "end",
                        }}
                    >
                        <Typography sx={{ paddingRight: "1rem" }} variant="h5">
                            {overviewData?.policies}
                        </Typography>
                        <Typography sx={{ paddingRight: "1rem" }} >
                            This month
                        </Typography>

                    </Box>
                </Box>

                {ComapnayPolicies.map((data, index) => (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between" }} key={index}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "start",
                                    gap: "0.3rem",
                                    alignItems: "center",
                                    color: "#60176F"
                                }}
                            >
                                {data.icon}

                                <Typography sx={{ paddingRight: "2rem", fontSize: "15px", color: "#111927" }} variant="h6">
                                    {data.companyName}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ paddingRight: "2rem", fontSize: "15px" }} variant="h6">
                                    {data.totalProposal}
                                </Typography>
                            </Box>
                        </Box>
                        <BorderLinearProgress variant="determinate" value={data.totalProposal} />
                    </Box>
                ))}
            </Card>
        </>
    );
};

export default ComapnayPolicie;
