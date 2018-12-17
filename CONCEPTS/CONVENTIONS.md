
# Coding conventions and rules used in this project

# Accessing of elements

## Accessing memory
To get a reference to the memory use MemoryUtil#getMemory.
It enables a consistent way to access memory objects.

To access elements in the (own) memory object use the bracket syntax e.g.:
>	mem['elementName']

## Access object Properties
To  access a property of an object that represents a 'class'
use the dot syntax wherever possible.
When using the collection (bracket) syntax use '' for static property names.

## Main-object (class) names
Use camel case and an upper character at the start

# string notation
When dealing with normal strings use "".
When requiring a property key (for example to access elements) use ''.
'' Should also be used if the static string should represent
or reference an object in memory.
