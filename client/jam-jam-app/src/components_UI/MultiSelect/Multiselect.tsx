import * as React from "react"
import {useEffect} from "react"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select, {SelectChangeEvent} from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"
import "./MultiSelect.css"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

interface SelectProps {
  dataArray: Array<Object>
  selectedDB: Array<Object>
  selectedCallbackFn: Function
  selectionName: string
  ifRequired: boolean
}

export default function MultiSelect(props: SelectProps | null) {
  const [selectedUI, setSelectedUI] = React.useState<string[]>([])

  useEffect(() => {
    if (props?.selectedDB && props?.selectedDB.length > 0) {
      const idArrayDefault: Array<string> = []
      props?.selectedDB.map((selection: any) =>
        idArrayDefault.push(selection[props.selectionName])
      )
      setSelectedUI(idArrayDefault)
    }
  }, [props?.selectedDB.length])

  const handleChange = (event: SelectChangeEvent<typeof selectedUI>) => {
    const {
      target: {value},
    } = event

    const idArray: Array<string> = []
    props?.dataArray.map(
      (selection: any) =>
        value.includes(selection[props.selectionName]) &&
        idArray.push(selection._id)
    )
    props?.selectedCallbackFn(idArray)
    const idArrayDefault: Array<string> = []

    props?.selectedDB.map(
      (selection: any) =>
        value.includes(selection[props.selectionName]) &&
        idArrayDefault.push(selection[props.selectionName])
    )
    setSelectedUI(typeof value === "string" ? value.split(",") : value)
  }

  return (
    <>
      <FormControl
        size="small"
        className="multiselectContainer"
        style={{
          marginTop: "20px",
        }}>
        <InputLabel id="demo-multiple-checkbox-label">
          {props?.selectionName || "Select"}
        </InputLabel>
        <Select
          className="oneSelect"
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          required={props?.ifRequired}
          value={selectedUI}
          onChange={handleChange}
          input={<OutlinedInput label={props?.selectionName || "Select"} />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}>
          {props?.dataArray?.map((name: any) => (
            <MenuItem key={name._id} value={name[props.selectionName]}>
              <Checkbox
                checked={selectedUI.indexOf(name[props.selectionName]) > -1}
              />
              <ListItemText primary={name[props.selectionName]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
