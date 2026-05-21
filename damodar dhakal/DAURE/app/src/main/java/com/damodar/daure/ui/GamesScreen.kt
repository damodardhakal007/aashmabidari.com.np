package com.damodar.daure.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.damodar.daure.data.model.ServiceItem
import com.google.accompanist.permissions.ExperimentalPermissionsApi

@Composable
fun GamesScreen(
    viewModel: HomeViewModel,
    onNavigateToBrowser: (url: String, title: String, serviceId: String) -> Unit
) {
    val language by viewModel.language.collectAsState()
    val expandedSections by viewModel.expandedSections.collectAsState()
    val isOnline by viewModel.isOnline.collectAsState()
    val filteredGames by viewModel.filteredGames.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        val scrollState = rememberScrollState()
        
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(16.dp)
        ) {
            Spacer(modifier = Modifier.height(32.dp))

            TicTacToeGame()

            Spacer(modifier = Modifier.height(24.dp))
            
            ServiceSectionView(
                title = if (language == "ne") "खेलहरू" else "Games",
                items = filteredGames,
                isExpanded = true, // Always expanded in this screen
                onToggle = { },
                onItemClick = { item ->
                    if (isOnline) {
                        onNavigateToBrowser(item.url, if (language == "ne") item.nameNe else item.name, item.id)
                    }
                },
                language = language,
                initialLimit = 100
            )
        }
    }
}

@Composable
fun TicTacToeGame() {
    var board by remember { mutableStateOf(List(9) { "" }) }
    var isXNext by remember { mutableStateOf(true) }
    var winner by remember { mutableStateOf<String?>(null) }

    fun checkWinner(currentBoard: List<String>): String? {
        val lines = listOf(
            listOf(0, 1, 2), listOf(3, 4, 5), listOf(6, 7, 8),
            listOf(0, 3, 6), listOf(1, 4, 7), listOf(2, 5, 8),
            listOf(0, 4, 8), listOf(2, 4, 6)
        )
        for (line in lines) {
            if (currentBoard[line[0]].isNotEmpty() &&
                currentBoard[line[0]] == currentBoard[line[1]] &&
                currentBoard[line[0]] == currentBoard[line[2]]
            ) {
                return currentBoard[line[0]]
            }
        }
        if (currentBoard.none { it.isEmpty() }) return "Draw"
        return null
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.9f)),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Tic Tac Toe",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1976D2)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = when {
                    winner == "Draw" -> "It's a Draw!"
                    winner != null -> "Winner: $winner"
                    else -> "Next Player: ${if (isXNext) "X" else "O"}"
                },
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
                color = if (winner != null) Color(0xFF4CAF50) else Color.Gray
            )

            Spacer(modifier = Modifier.height(16.dp))

            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                for (row in 0 until 3) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        for (col in 0 until 3) {
                            val index = row * 3 + col
                            Box(
                                modifier = Modifier
                                    .size(80.dp)
                                    .background(
                                        color = if (board[index].isEmpty()) Color(0xFFF5F5F5) 
                                               else if (board[index] == "X") Color(0xFFBBDEFB) 
                                               else Color(0xFFFFCDD2),
                                        shape = RoundedCornerShape(12.dp)
                                    )
                                    .border(
                                        width = 1.dp,
                                        color = Color.LightGray,
                                        shape = RoundedCornerShape(12.dp)
                                    )
                                    .clickable(enabled = board[index].isEmpty() && winner == null) {
                                        val newBoard = board.toMutableList()
                                        newBoard[index] = if (isXNext) "X" else "O"
                                        board = newBoard
                                        isXNext = !isXNext
                                        winner = checkWinner(newBoard)
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = board[index],
                                    fontSize = 32.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = if (board[index] == "X") Color(0xFF1976D2) else Color(0xFFD32F2F)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    board = List(9) { "" }
                    isXNext = true
                    winner = null
                },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2))
            ) {
                Text("Restart Game")
            }
        }
    }
}

