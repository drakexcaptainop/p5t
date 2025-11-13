import numpy as np 



ft = np.fft.fft([1, 3])
print(ft/2, ft.shape)

print(np.fft.ifft( ft )
)
