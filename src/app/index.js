import React, { useEffect, useState, useMemo } from "react";
import TableHeader from "../components/Header";
import Pagination from "../components/Pagination";
import Search from "../components/Search";

import './styles.css';

function DataTable() {
  const [comments, setComments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });

  const ITEMS_PER_PAGE = 50;

  const headers = [
    { name: "No.", field: "id", sortable: false },  //since id is Integer
    { name: "Name", field: "name", sortable: true },
    { name: "Email", field: "email", sortable: true },
    { name: "Comment", field: "body", sortable: false }
  ];

  useEffect(() => {
    const getData = () => {

      fetch("https://jsonplaceholder.typicode.com/comments")
        .then(response => response.json())
        .then(json => {
          setComments(json);
          console.log(json);
        });
    };

    getData();
  }, []);

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        comment => 
          comment.id.toString().toLowerCase().indexOf(search.toLowerCase()) > -1 ||
          comment.name.toLowerCase().includes(search.toLowerCase()) ||
          comment.email.toLowerCase().includes(search.toLowerCase()) ||
          comment.body.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedComments.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedComments = computedComments.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedComments.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [comments, currentPage, search, sorting]);

  return (
    <>
      <h1>Building a data table in react</h1>

      <div>
        <div>
          <div>
          <div>
              <Pagination
                total={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={page => setCurrentPage(page)} />
            </div>
            <div>
              <Search
                onSearch={value => {
                  setSearch(value);
                  setCurrentPage(1);
                } } />
            </div>
          </div>

          <table>
            <TableHeader
              headers={headers}
              onSorting={(field, order) => setSorting({ field, order })} />
            <tbody>
              {commentsData.map(comment => (
                <tr>
                  <th scope="row" key={comment.id}>
                    {comment.id}
                  </th>
                  <td>{comment.name}</td>
                  <td>{comment.email}</td>
                  <td>{comment.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default DataTable;
