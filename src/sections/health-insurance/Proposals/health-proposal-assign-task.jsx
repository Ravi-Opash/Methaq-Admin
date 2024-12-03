import { Card, Grid, Skeleton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { assignHealthProposalToAgent, getAllHealthAgentlist } from "./Action/healthInsuranceAction";
import AnimationLoader from "src/components/amimated-loader";

export default function HealthProposalAssignTask({ proposalId, assignedAgent }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(assignedAgent || "");
  const [agentList, setAgentList] = useState([]);

  useEffect(() => {
    if (assignedAgent) {
      setSelectedAgent(assignedAgent);
    }
  }, [assignedAgent]);

  const initial = useRef(false);

  useEffect(() => {
    if (initial.current) {
      return;
    }
    initial.current = true;
    dispatch(getAllHealthAgentlist({}))
      .unwrap()
      .then((res) => {
        setAgentList(res?.data);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  return (
    <>
      {loading && <AnimationLoader open={true} />}
      <Box mb={2}>
        <Card>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              width: "100%",
              py: 1.5,
              backgroundColor: "#f5f5f5",
              mb: 1,
              fontWeight: "600",
              fontSize: "18px",
              display: "inline-block",
              color: "#60176F",
              px: "14px",
            }}
          >
            Proposal assign to agent
          </Typography>
          <Box sx={{ m: 2 }}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                {agentList?.length > 0 ? (
                  <TextField
                    fullWidth
                    label="Agents"
                    name="agent"
                    onChange={(e) => {
                      setLoading(true);
                      setSelectedAgent(e.target.value);
                      dispatch(
                        assignHealthProposalToAgent({
                          proposalId: proposalId,
                          adminId: e.target.value,
                        })
                      )
                        .unwrap()
                        .then((res) => {
                          toast?.success("Successfully assigned proposal!");
                          setLoading(false);
                        })
                        .catch((err) => {
                          console.log(err, "err");
                          toast?.error(err);
                          setLoading(false);
                        });
                    }}
                    select
                    SelectProps={{ native: true }}
                    value={selectedAgent}
                  >
                    <option value=""></option>
                    {agentList.map((agent) => {
                      if (!agent?.userId?._id) {
                        return;
                      }
                      return <option value={agent?.userId?._id}>{agent?.userId?.fullName}</option>;
                    })}
                  </TextField>
                ) : (
                  <>
                    <Skeleton height={40} />
                    <Skeleton height={10} />
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>
    </>
  );
}
