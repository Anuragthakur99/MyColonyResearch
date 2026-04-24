import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Calendar } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(store => store.company);
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredCompany = companies.length >= 0 && companies.filter((company) => {
      if (!searchCompanyByText) {
        return true
      }
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    })
    setFilterCompany(filteredCompany)
  }, [companies, searchCompanyByText])

  // Check if companies is an array and if it's empty
  if (!Array.isArray(companies) || companies.length === 0) {
    return <span className="text-gray-500 font-semibold">Colony Not Found!</span>;
  }

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-lg">
      <Table className="w-full">
        <TableCaption>A list of your recently registered Colony</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-900">
            <TableHead className="text-gray-200">Logo</TableHead>
            <TableHead className="text-gray-200">Name</TableHead>
            <TableHead className="text-gray-200">Date</TableHead>
            <TableHead className="text-right text-gray-200">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany.map((company) => (
            <TableRow key={company._id} className="hover:bg-gray-100 transition-colors duration-300">
              <TableCell>
                <Avatar className="h-10 w-10 border-2 border-gray-300">
                  <AvatarImage
                    src={company.logo || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                    alt={`${company.name} logo`}
                  />
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>
                <span className="w-2/5 flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200 text-gray-800 text-xs font-medium">
                  <Calendar className="w-3 h-3" />
                  {company.createdAt.split("T")[0]}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger>
                    <button className="p-2 hover:bg-gray-600 rounded-full transition-colors duration-300">
                      <MoreHorizontal className="w-5 h-5 text-gray-100" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 bg-white border border-gray-200 shadow-lg">
                    <div 
                      onClick={() => navigate(`/admin/companies/${company._id}`)} 
                      className="flex items-center w-full gap-2 cursor-pointer p-2 hover:bg-gray-100 transition-colors duration-300 rounded"
                    >
                      <Edit2 className="w-4 text-gray-600" />
                      <span className="text-gray-800">Edit</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CompaniesTable;

