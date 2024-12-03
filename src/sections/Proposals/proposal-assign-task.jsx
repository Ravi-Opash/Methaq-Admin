import { Card, Grid, Skeleton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { assignProposalToAgent, getAllAgentlist } from "./Action/proposalsAction";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";

export default function ProposalAssignTask({ proposalId, assignedAgent }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(assignedAgent || "");
  const [agentList, setAgentList] = useState([]);

  const initial = useRef(false);

  useEffect(() => {
    if (assignedAgent) {
      setSelectedAgent(assignedAgent);
    }
  }, [assignedAgent]);

  useEffect(() => {
    if (initial.current) {
      return;
    }
    initial.current = true;
    dispatch(getAllAgentlist({}))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
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
                <TextField
                  fullWidth
                  label="Agents"
                  name="agent"
                  onChange={(e) => {
                    setSelectedAgent(e.target.value);
                    setLoading(true);
                    dispatch(
                      assignProposalToAgent({
                        proposalId: proposalId,
                        adminId: e.target.value,
                      })
                    )
                      .unwrap()
                      .then((res) => {
                        setLoading(false);
                        toast?.success("Successfully assigned proposal!");
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
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>
    </>
  );
}
