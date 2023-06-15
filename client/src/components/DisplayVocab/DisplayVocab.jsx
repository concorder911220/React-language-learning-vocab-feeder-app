import React from "react";

import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
} from "@table-library/react-table-library/table";
import styles from "./DisplayVocab.module.css";
import { useTheme } from "@table-library/react-table-library/theme";

import { usePagination } from "@table-library/react-table-library/pagination";
import TableSearch from "./TableSearch/TableSearch";
import TableFooter from "./TableFooter/TableFooter";
import Vocab from "./../Vocab/Vocab";

const DisplayVocab = ({
  data,
  LIMIT,
  search,
  handleSearch,
  isEditing,
  editForm,
  setEditForm,
  setIsEditing,
}) => {
  const theme = useTheme({
    HeaderRow: `
        background-color: #eaf5fd;
        .th {
          border-bottom: 1px solid #a0a8ae;
        }
      `,
    Row: `
        &:nth-of-type(odd) {
          background-color: #d2e9fb;
        }

        &:nth-of-type(even) {
          background-color: #eaf5fd;
        }
      `,
    BaseCell: `
        padding: 11px;
      `,
    Cell: `
        &:not(:last-of-type) {
          border-right: 1px solid #a0a8ae;
        }
      `,
  });

  const columns = [
    {
      label: "Dutch",
      field: "dutch",
    },
    {
      label: "English",
      field: "english",
    },
    {
      label: "Pronunciation URL",
      field: "pronunciationlink",
    },
    {
      label: "Notes",
      field: "notes",
    },
    {
      label: "Category",
      field: "set_name",
    },
    {
      label: "Actions",
      field: "editBtn",
    },
  ];

  // capture the vocab you wish to edit, set to state
  const captureEdit = (clickedVocab) => {
    let filtered = data.filter((vocab) => vocab.id === clickedVocab.id);
    setEditForm(filtered[0]);
  };

  const currentData = {
    nodes: data.filter((vocabRecord) =>
      vocabRecord.dutch.toLowerCase().includes(search.toLowerCase())
    ),
  };

  const pageCount = parseInt(data.length / LIMIT) + 1;
  const pagination = usePagination(currentData, {
    state: {
      page: 0,
      size: LIMIT,
    },
  });

  // needed logic for conditional rendering of the form - shows the vocab you want when you want them, and hides it when you don't
  const changeEditState = (vocab) => {
    if (vocab.id === editForm.id) {
      setIsEditing((isEditing) => !isEditing); // hides the form
    } else if (isEditing === false) {
      setIsEditing((isEditing) => !isEditing); // shows the form
    }
  };

  return (
    <>
      <TableSearch
        styles={styles}
        handleSearch={handleSearch}
        searchValue={search}
      />

      <div className={styles.vocabEntryBtn}>
        <input type="submit" value="Add Vocab Entry" />
      </div>

      <div className={styles.wrapper}>
        <Table data={currentData} theme={theme} pagination={pagination}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  {columns.map((column) => (
                    <HeaderCell key={column.field}>{column.label}</HeaderCell>
                  ))}
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((vocab) => (
                  <Vocab
                    key={vocab.id}
                    vocab={vocab}
                    captureEdit={captureEdit}
                    changeEditState={changeEditState}
                  />
                ))}
              </Body>
            </>
          )}
        </Table>

        <TableFooter pagination={pagination} pageCount={pageCount} />
      </div>
    </>
  );
};

export default DisplayVocab;
