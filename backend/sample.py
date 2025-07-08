def sumar_pares_en_rango(start,finish):
    nums = [i for i in range(start,finish+1)]
    total = 0
    for num in nums:
        if num%2 == 0:
            total += num
    return total

print(sumar_pares_en_rango(1,10))

def es_palindromo(s):
    frase = s.split(" ")
    joined = "".join(frase).lower()
    reverse = joined[::-1]
    if joined == reverse:
        return True
    return False

print(es_palindromo("Anita lava la tina"))
