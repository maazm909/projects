def isFilled(chart):
    match = chart[0][0]
    for i in chart:
        for j in chart[row]:
            if match != chart[i][j]:
                return False
    return True
