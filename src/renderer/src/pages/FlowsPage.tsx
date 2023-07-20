import { useQuery } from "react-query"
import { GetFlows } from "../services/BotServices"
import { AxiosResponse } from "axios"
import { IFlow } from "../types/flow.types"
import { BackendError } from "../types"
import { Button } from "react-bootstrap"
import { useEffect, useContext, useState } from "react"
import { AppChoiceActions, ChoiceContext } from "../contexts/DialogContext"
import UpdateFlowModel from "../components/modals/flows/UpdateFlowModel"
import CreateFlowModal from "../components/modals/flows/CreateFlowModal"
import DeleteFlowModal from "../components/modals/flows/DeleteFlowModal"
import { UserContext } from "../contexts/UserContext"

export default function FlowsPage() {
  const [flows, setFlows] = useState<IFlow[]>()
  const [flow, setFlow] = useState<IFlow>()
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const { data } = useQuery<AxiosResponse<IFlow[]>, BackendError>("flows", GetFlows)

  useEffect(() => {
    if (data)
      setFlows(data.data)
  }, [data])


  return (
    <>

      <div className="d-flex-column gap-2 p-2 pt-4 overflow-auto">
        <div style={{ cursor: "pointer" }} className="border-danger btn m-2 rounded  fs-6 mt-1"
        >
          <div className="d-flex gap-1 align-items-center justify-content-center"
            onClick={() => setChoice({ type: AppChoiceActions.create_flow })}
          >
            <img width="30" height="30" src="https://img.icons8.com/plasticine/100/serial-tasks.png" alt="undo" />
            <span >New Flow</span>
          </div>
        </div>
        <table className="table">
          <thead >
            <tr>
              <th style={{ minWidth: '150px' }} scope="col">Index</th>
              <th style={{ minWidth: '150px' }} scope="col">Status</th>
              <th style={{ minWidth: '150px' }} scope="col">Connected Phone</th>
              <th style={{ minWidth: '150px' }} scope="col">Flow Name</th>
              <th style={{ minWidth: '150px' }} scope="col">Triggers</th>
              <th style={{ minWidth: '150px' }} scope="col">Last Updated</th>
              <th style={{ minWidth: '150px' }} scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              flows && flows.length > 0 ?
                <>
                  {flows.map((flow, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{user?.connected_number ? "active" : "disabled"}</td>
                        <td>{String(user?.connected_number).replace("@c.us", "")}</td>
                        <td>{flow.flow_name}</td>
                        <td>{flow.trigger_keywords}</td>
                        <td>{flow.updated_at && new Date(flow.updated_at).toLocaleString()}</td>
                        <td className="d-flex gap-1">
                          <Button size="sm" variant="primary" onClick={() => {
                            setFlow(flow)
                            setChoice({ type: AppChoiceActions.update_flow })
                          }}>Edit</Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => {
                              setFlow(flow)
                              setChoice({ type: AppChoiceActions.delete_flow })
                            }}
                          >Delete</Button>
                        </td>
                      </tr>
                    )
                  })}
                </>
                : null
            }
          </tbody>
        </table>
        {flow ? <UpdateFlowModel selectedFlow={flow} /> : null}
        <CreateFlowModal />
        {flow ? <DeleteFlowModal flow={flow} /> : null}
      </div>
    </>

  )
}
