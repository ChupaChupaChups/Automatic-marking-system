
## ===================== Binary Search ==========================

def bSearch(L, e, low ,high):
    if high - low < 2:
        return L[low] == e or L[high] == e
    mid = low + int((high - low)/2)
    if L[mid] == e:
        return True
    if L[mid] > e:
        return bSearch(L, e, low, mid-1)
    else:
        return bSearch(L, e, mid+1, high)


## ====================== Selection Sorting ======================
def selSort(L):
    """Assume that L is a list of elements that can using >. Sorts L in ascending order"""
    for i in range(len(L)-1):
        #Invariant: the list L[:i] is sorted

        minIndex = i
        minVal = L[i]
        j = i + 1
        while j < len(L):
            
            if minVal > L[j]:
                minIndex = j
                minVal = L[j]
            j += 1
            
        #change position L[minIndex] -> L[i], L[i] -> L[minIndex]
        temp = L[i]
        L[i] = L[minIndex]
        L[minIndex] = temp
        print ("Partially sorted list = ", L)


##L = [35, 4, 5, 29, 17, 58, 0]
##selSort(L)
##print ("Sorted List= ",L)

## ========== Binary Search =====================

##findValue=int(input("Enter Value: "))
##print ("Binary Search= ", bSearch(L, findValue, 0, len(L)))

## ======================== Merge Sorting ===========================
def merge(left, right, lt):
    """Assume left and right are sorted lists.
     lt defines an ordering on the elements of the lists.
     Returns a new sorted(by lt) list containing the same elements
     as (left+right) would contain."""
    result = []
    i, j = 0, 0
    while i < len(left) and j < len(right):
        if lt(left[i], right[j]):
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    while i < len(left):
        result.append(left[i])
        i += 1
    while j < len(right):
        result.append(right[j])
        j += 1
    return result


def sort ( L , lt = lambda x, y: x < y):
    """Returns a new sorted list containing the same elements as L"""
    if len(L) < 2:
        return L[:]
    else:
        middle = int(len(L)/2)
        left = sort(L[:middle], lt)
        right = sort(L[middle:], lt)
        print ("About to merge ", left, "and ", right)
        return merge(left, right, lt)


##L = [35, 4, 5, 29, 17, 58, 0]
##newL = sort(L)
##print ("Sorted List= ", newL)
##L = [1.0, 2.25, 24.5, 12.0, 2.0, 23.0, 19.125, 1.0]
##newL = sort(L, float.__lt__)
##print ("Sorted List= ", newL)




# python 2.7
# import string
# string.split( Str, ' ')

# python 3.4
# Str.split(' ')
def lastName_FirstName(name1, name2):
    
    name1 = name1.split(' ')
    name2 = name2.split(' ')
    if name1[1] != name2[1]:
        return name1[1] < name2[1]
    else:
        return name1[0] < name2[0]

def firstName_LastName(name1, name2):
    
    name1 = name1.split(' ')
    name2 = name2.split(' ')

    if name1[0] != name2[0]:
        return name1[0] < name2[0]
    else:
        return name1[1] < name2[1]

##L = ["John Guttang", "Tom Brady", "Chancellor Grimson", "Gisele Brady", "Big Julie"]
##newL = sort(L, lastName_FirstName)
##print ("Sorted List= ",newL)
##newL = sort(L, firstName_LastName)
##print ("Sorted List= ",newL)
