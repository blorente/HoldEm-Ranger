values = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
suits = ['s', 'o']

htmlTableTemplate = '<table><tbody>\n'
htmlCellTemplate = "\t\t\t<td id=\"(id)\" onmouseover=\"return tableClick(this);\" onmousedown=\"return tableClick(this);\">(content)</td>\n"

def main():
    matrix = generateMatrices()
    #printRawMatrix(matrix)
    formatted = formatMatrix(htmlCellTemplate, matrix)
    print(formatted)

def generateMatrices():
    table = [[]]
    valuesNum = len(values)
    for y in range(0, valuesNum):
        for x in range(0, valuesNum):
            toAdd = ''
            if x == y:
                # Pocket pair
                toAdd = values[x] + values[x]
            elif x > y:
                # Suited
                toAdd = values[y] + values[x]+'s'
            elif x < y:
                # Offsuit
                toAdd = values[x] + values[y]+'o'

            #print('Adding %s at pos (%d, %d)' % (toAdd, x, y))

            table[y].append(toAdd)
        table.append([])

    table.pop()
    return table

def printRawMatrix(matrix):
    for line in matrix:
        print(line)

def formatMatrix(template, matrix):
    output = htmlTableTemplate
    x = 0
    y = 0
    for line in matrix:
        output += '\t<tr>\n'
        for cell in line:
            id = str(x)+'-'+str(y)
            toAdd = template
            toAdd = toAdd.replace('(id)', id)
            toAdd = toAdd.replace('(content)', cell)
            output += toAdd
            x = x + 1
        output += '\t</tr>\n'
        y = y + 1
        x = 0
    output += '</tbody></table>\n'
    return output

main()
