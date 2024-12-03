import { Box, Container } from '@mui/system';
import React, { useEffect, useRef } from 'react'
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import LeadHistoryTable from 'src/sections/Leads/lead-history-table';
import NextLink from "next/link";
import { Button, Grid, Link, Typography } from '@mui/material';
import { ArrowLeft } from 'src/Icons/ArrowLeft';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getLeadDetailsById } from 'src/sections/Leads/Action/leadsAction';

const LeadDetails = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { leadId } = router.query;

    const initializedPolicy = useRef(false);

    // get leads from API
    const getLeadyDetailsHandler = async () => {
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (initializedPolicy.current) {
            return;
        }
        initializedPolicy.current = true;
        try {
            dispatch(getLeadDetailsById(leadId)).unwrap().then((res) => {
                // console.log(" lead res", res);
            }).catch((err) => {
                console.log(err);
            })
        } catch (err) {
            toast(err, {
                type: "error",
            });
        }
    };
    useEffect(() => {
        getLeadyDetailsHandler();
    }, [])
    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 3,
            }}
        >
            <Container maxWidth={false}>
                <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
                    <Box
                        sx={{
                            display: "inline-block",
                        }}
                    >
                        <NextLink href="/leads" passHref>
                            <Link
                                color="textPrimary"
                                component="a"
                                sx={{
                                    alignItems: "center",
                                    display: "flex",
                                }}
                            >
                                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="subtitle2">Lead</Typography>
                            </Link>
                        </NextLink>
                    </Box>

                    <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                        <Grid container justifyContent="space-between" spacing={3}>
                            <Grid item>
                                <Typography variant="h4">Leads Details</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <LeadHistoryTable />
                </Box>
            </Container>
        </Box>
    )
}
LeadDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default LeadDetails;